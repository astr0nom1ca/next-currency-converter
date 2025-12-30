'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { CURRENCY_OPTIONS } from '../constants/currencies';
import { getConversionResult } from '../services/api';

export default function CurrencyConverterForm() {
  const [amount, setAmount] = useState<string>('');
  const [base, setBase] = useState<string>('USD');
  const [target, setTarget] = useState<string>('EUR');
  const [displayMsg, setDisplayMsg] = useState<string>('');
  
  // 1. Load saved currencies on mount
  useEffect(() => {
    const savedBase = localStorage.getItem('user-base-currency');
    const savedTarget = localStorage.getItem('user-target-currency');
    if (savedBase) setBase(savedBase);
    if (savedTarget) setTarget(savedTarget);
  }, []);

  // 2. Save currencies whenever they change
  useEffect(() => {
    localStorage.setItem('user-base-currency', base);
    localStorage.setItem('user-target-currency', target);
  }, [base, target]);

  const FLOAT_REGEX = /^\d*\.?\d*$/;

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || FLOAT_REGEX.test(value)) {
      setAmount(value);
    }
  };

  const handleSwap = () => {
    const temp = base;
    setBase(target);
    setTarget(temp);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!amount || parseFloat(amount) === 0) {
      setDisplayMsg('Please enter a valid amount.');
      return;
    }

    setDisplayMsg('Converting...');

    const data = await getConversionResult(amount, base, target);

    if (data.success) {
      setDisplayMsg(`${amount} ${base} is equal to ${data.result} ${target}`);
    } else {
      setDisplayMsg(data.error || 'Something went wrong');
    }
  };

  const renderOptions = () => {
    return CURRENCY_OPTIONS.map((currency, index) => {
      if ('divider' in currency && currency.divider) {
        return <option key={`divider-${index}`} disabled>──────────</option>;
      }
      return (
        //@ts-ignore
        <option key={currency.value} value={currency.value}>
          {currency.value} - {currency.label}
        </option>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-2 border-gray-400 rounded-xl shadow-lg max-w-md mx-auto bg-white space-y-4">
      <h2 className="text-xl font-bold text-black mb-4 text-center">Currency Converter</h2>

      <div>
        <label className="block text-sm font-bold text-black">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount..."
          className="mt-1 block w-full px-4 py-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 text-black outline-none"
          inputMode="decimal"
          required
        />
      </div>

      <div className="flex items-end justify-center pb-2">
        <button
          type="button"
          onClick={handleSwap}
          className="p-2 rounded-full bg-black hover:bg-blue-700 text-white transition-colors border border-blue-400"
          title="Swap Currencies"
        >
          ⇄
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black">From</label>
          <select 
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {renderOptions()}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-black">To</label>
          <select 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {renderOptions()}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
      >
        Convert
      </button>

      <div id="display" className="mt-6 p-4 bg-gray-100 rounded-lg text-center text-black font-bold border-2 border-dashed border-gray-400">
        {displayMsg || "Enter an amount to see conversion"}
      </div>
    </form>
  );
}