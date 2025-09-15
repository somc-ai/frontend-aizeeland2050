import React, { Component, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8 text-center">
          <div className="bg-white p-10 rounded-lg shadow-xl">
            <h2 className="text-red-600 font-bold text-2xl mb-4">Er is een onverwachte fout opgetreden</h2>
            <p className="text-slate-600 mb-6">Onze excuses voor het ongemak. U kunt proberen de applicatie te herstellen.</p>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors" 
              onClick={() => window.location.reload()}
            >
              Herstel applicatie
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}