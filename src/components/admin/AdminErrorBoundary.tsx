'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class AdminErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Admin Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-red-600 mb-2">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600">
                                An error occurred while loading the admin page. Please try refreshing or contact support.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full cursor-pointer"
                            >
                                Refresh Page
                            </Button>

                            <Button
                                onClick={() => this.setState({ hasError: false })}
                                variant="outline"
                                className="w-full cursor-pointer"
                            >
                                Try Again
                            </Button>
                        </div>

                        {this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500">
                                    Error Details
                                </summary>
                                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
