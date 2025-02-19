import React from 'react';
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // 发送错误到 Sentry
    Sentry.withScope((scope) => {

      scope.setExtras(errorInfo as any);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
    
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-[#1A1B1F]">
          <div className="w-full max-w-2xl bg-[#2C2D33] rounded-lg shadow-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-200">Error Message:</h3>
              <pre className="bg-[#1A1B1F] text-gray-300 p-3 rounded overflow-auto max-h-[200px] text-sm border border-gray-700">
                {this.state.error?.message}
              </pre>
            </div>

            {this.state.error?.stack && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-200">Stack Trace:</h3>
                <pre className="bg-[#1A1B1F] text-gray-300 p-3 rounded overflow-auto max-h-[200px] text-sm border border-gray-700">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            {this.state.errorInfo?.componentStack && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-200">Component Stack:</h3>
                <pre className="bg-[#1A1B1F] text-gray-300 p-3 rounded overflow-auto max-h-[200px] text-sm border border-gray-700">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              
              {this.state.eventId && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}
                >
                  Report feedback
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 