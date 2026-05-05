import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,45,85,0.08)' }}
          >
            <AlertTriangle size={28} style={{ color: '#ff2d55' }} />
          </div>
          <h3 className="text-lg font-black mb-2" style={{ color: '#0d0b18' }}>
            Something went wrong
          </h3>
          <p className="text-sm mb-6 max-w-xs leading-relaxed" style={{ color: 'rgba(13,11,24,0.5)' }}>
            {this.state.error?.message || 'An unexpected error occurred. Please refresh and try again.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
