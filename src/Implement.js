import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

const Exchange = () => {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // List of supported currencies
  const currencyList = ["USD", "EUR", "GBP", "AUD", "CAD", "JPY", "CHF", "CNY", "INR"];

  useEffect(() => {
    // Reset error and loading state
    setError("");
    setIsLoading(true);

    // Validate input before fetching
    if (baseCurrency === targetCurrency) {
      setError("Base and target currencies must be different.");
      setIsLoading(false);
      return;
    }

    // Fetch exchange rates
    fetch(`https://v6.exchangerate-api.com/v6/fc8d7285f60815073c90c170/latest/${baseCurrency}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRates(data.conversion_rates);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Failed to fetch exchange rates. Please try again.");
        setIsLoading(false);
      });
  }, [baseCurrency, targetCurrency]);

  const convertCurrency = () => {
    if (rates[targetCurrency]) {
      const rate = rates[targetCurrency];
      return (amount * rate).toFixed(3);
    }
    return 0;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
        <h1 className="text-center text-3xl font-bold text-white mb-6">Currency Converter</h1>

        {error && (
          <div className="flex items-center bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
            <AlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4">
          <div>
            <label className="block text-white mb-2">Base Currency</label>
            <select
              className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {currencyList.map((currency) => (
                <option key={currency} value={currency} className="bg-gray-800">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Target Currency</label>
            <select
              className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
            >
              {currencyList.map((currency) => (
                <option key={currency} value={currency} className="bg-gray-800">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div className="bg-white/20 p-4 rounded-lg text-center">
            {isLoading ? (
              <p className="text-white animate-pulse">Fetching rates...</p>
            ) : (
              <h3 className="text-xl font-semibold text-white">
                <span className="text-cyan-300">{amount.toLocaleString()} {baseCurrency}</span>{" "}
                = {" "}
                <span className="text-green-300">{convertCurrency()} {targetCurrency}</span>
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;