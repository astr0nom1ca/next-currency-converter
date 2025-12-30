const API_KEY = process.env.NEXT_PUBLIC_APILAYER_KEY || '';
const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest';

export async function getConversionResult(amount: string, base: string, target: string) {
  const myHeaders = new Headers();
  myHeaders.append("apikey", API_KEY);

  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  try {
    // We fetch the latest rates based on your selected 'base' currency
    const response = await fetch(`${BASE_URL}?base=${base}`, requestOptions);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // The rate for our target currency
    const rate = data.rates[target];

    if (rate !== undefined) {
      const amnt = parseFloat(amount);
      const conversion = amnt * rate;
      return {
        success: true,
        result: conversion.toFixed(2),
        rate: rate
      };
    } else {
      return { success: false, error: 'Invalid Currency!' };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: 'Connection to API failed' };
  }
}