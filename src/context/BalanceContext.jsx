// src/context/BalanceContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const BalanceContext = createContext();

export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, date: "2025-10-31", user: "Admin", type: "Credit", amount: 5000, status: "Success" },
  ]);

  // CRUD functions
  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, { id: Date.now(), ...transaction }]);
  };

  const editTransaction = (id, updated) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...updated, id } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Totals
  const totalCredits = transactions.filter(t => t.type === "Credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === "Debit").reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalCredits - totalDebits;

  return (
    <BalanceContext.Provider value={{
      transactions,
      totalBalance,
      totalCredits,
      totalDebits,
      addTransaction,
      editTransaction,
      deleteTransaction
    }}>
      {children}
    </BalanceContext.Provider>
  );
};
