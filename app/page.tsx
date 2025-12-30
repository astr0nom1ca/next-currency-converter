// app/page.tsx
// Note: Next.js components are implicitly typed as React Functional Components (RFC)

import CurrencyConverterForm from './components/ConverterForm';
import FloatForm from './components/ConverterForm'; // Assuming FloatForm.tsx is in the components directory

// Define the component as a default export
export default function HomePage() {
  return (
    // Standard wrapper for centering the form
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* The float-input form component */}
      <CurrencyConverterForm />
    </div>
  );
}