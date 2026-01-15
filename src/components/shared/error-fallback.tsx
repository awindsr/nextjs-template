import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4" role="alert">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-destructive">Something went wrong</h2>
        <p className="mb-4 text-muted-foreground">{error.message}</p>
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary} variant="outline">
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
