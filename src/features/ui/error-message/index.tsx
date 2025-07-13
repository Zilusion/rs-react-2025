import React from 'react';

interface ErrorMessageProps {
  error: string;
}

export class ErrorMessage extends React.Component<ErrorMessageProps> {
  render() {
    const { error } = this.props;
    return (
      <div
        className="rounded border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        <span className="font-medium">Error:</span> {error}
      </div>
    );
  }
}
