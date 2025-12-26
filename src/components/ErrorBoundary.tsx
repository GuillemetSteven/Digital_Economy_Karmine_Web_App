import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Composant Error Boundary pour capturer et g\u00e9rer les erreurs React
 * Emp\u00eache l'application de crasher compl\u00e8tement en cas d'erreur
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {
    // Erreur captur\u00e9e - pas de log en production
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-karmine-bg text-white">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-400">Une erreur s'est produite</h1>
            <p className="text-gray-300 mb-6">
              Désolé, quelque chose s'est mal passé. Veuillez recharger la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
