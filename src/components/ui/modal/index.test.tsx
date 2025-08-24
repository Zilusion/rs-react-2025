import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './index';

function ensureModalRoot(): HTMLDivElement {
  let root = document.getElementById('modal-root') as HTMLDivElement | null;
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  return root;
}

let modalRoot: HTMLDivElement;

beforeEach(() => {
  modalRoot = ensureModalRoot();
});

afterEach(() => {
  if (modalRoot.parentNode) {
    modalRoot.parentNode.removeChild(modalRoot);
  }
});

describe('Modal', () => {
  it('does not render when isOpen=false (нет портала)', () => {
    render(
      <Modal isOpen={false} onClose={() => null} title="X">
        <div>content</div>
      </Modal>,
    );
    expect(modalRoot.childElementCount).toBe(0);
  });

  it('renders into #modal-root portal when isOpen=true и выставляет a11y-атрибуты', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="My Modal">
        <button>Action</button>
      </Modal>,
    );

    const portal = screen.getByTestId('modal-portal');
    expect(portal).toBeInTheDocument();
    expect(modalRoot.contains(portal)).toBe(true);

    const dialog = screen.getByRole('dialog', { name: /my modal/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('sets initial focus to the first focusable element (кнопка Close)', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Focusable">
        <a href="#x">Link</a>
        <button>Action</button>
        <input aria-label="Some input" />
      </Modal>,
    );

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    expect(document.activeElement).toBe(closeBtn);
  });

  it('traps focus: Tab с последнего переносит на первый, Shift+Tab с первого — на последний', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Trap">
        <button>Action</button>
      </Modal>,
    );

    const modalNode = screen.getByTestId('modal');
    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    const actionBtn = screen.getByRole('button', { name: /action/i });

    actionBtn.focus();
    expect(document.activeElement).toBe(actionBtn);

    fireEvent.keyDown(modalNode, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.keyDown(modalNode, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(actionBtn);
  });

  it('calls onClose on Escape', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="ESC">
        <button>Action</button>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside (overlay)', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Overlay">
        <button>Action</button>
      </Modal>,
    );

    const portal = screen.getByTestId('modal-portal');
    const overlay = portal.querySelector(
      'div[aria-hidden="true"]',
    ) as HTMLDivElement;
    expect(overlay).toBeInTheDocument();

    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll on open и восстанавливает при закрытии', () => {
    const onClose = vi.fn();

    const prevOverflow = document.body.style.overflow || '';

    const { rerender, unmount } = render(
      <Modal isOpen onClose={onClose} title="Lock">
        <button>Action</button>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={onClose} title="Lock">
        <button>Action</button>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe(prevOverflow);

    rerender(
      <Modal isOpen onClose={onClose} title="Lock">
        <button>Action</button>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe(prevOverflow);
  });
});
