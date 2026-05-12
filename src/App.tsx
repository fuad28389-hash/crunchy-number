/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Hash, RotateCcw, Plus, Minus, X, Equal, Percent, Divide } from 'lucide-react';

type Operator = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOp: Operator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator);
      setPrevValue(result);
      setDisplay(String(Number(result.toFixed(8))));
    }

    setWaitingForNewValue(true);
    setOperator(nextOp);
  };

  const handleEqual = () => {
    if (!operator || prevValue === null) return;

    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operator);
    
    setHistory(prev => [`${prevValue} ${operator} ${inputValue} = ${Number(result.toFixed(8))}`, ...prev].slice(0, 5));
    setDisplay(String(Number(result.toFixed(8))));
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleDigit(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') handleBackspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operator, waitingForNewValue]);

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4 md:p-8 font-sans antialiased text-slate-800">
      <div className="w-full max-w-5xl bg-white flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-[40px]">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-rose-500 p-8 flex flex-col justify-between text-white">
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-bold leading-tight">Crunchy<br />Numbers.</h1>
              <p className="text-rose-100 mt-4 opacity-80">Friendly arithmetic for your daily adventures.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-rose-600/50 p-4 rounded-2xl border border-rose-400/30">
                <span className="text-[10px] uppercase tracking-widest text-rose-200 font-semibold">Current State</span>
                <p className="text-white text-lg mt-1 font-mono">
                  {operator ? `${prevValue} ${operator}` : 'Idle'}
                </p>
              </div>

              {history.length > 0 && (
                <div className="bg-rose-600/50 p-4 rounded-2xl border border-rose-400/30">
                  <span className="text-[10px] uppercase tracking-widest text-rose-200 font-semibold text-xs mb-2 block">Recent Log</span>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {history.map((item, i) => (
                      <p key={i} className="text-white/80 text-sm font-mono border-b border-rose-400/20 pb-1 last:border-0">{item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12 bg-rose-600/30 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 font-bold text-sm">CA</div>
            <div>
              <p className="text-white font-semibold text-xs">Arithmos</p>
              <p className="text-rose-100 text-[10px] opacity-70 italic">v2.0 Vibrant Pro</p>
            </div>
          </div>
        </aside>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col p-6 md:p-12 bg-white">
          <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            {/* Display */}
            <div className="bg-slate-50 rounded-[40px] p-8 mb-8 flex flex-col justify-end items-end h-48 border-2 border-slate-100 neon-shadow relative overflow-hidden transition-all duration-300">
               <AnimatePresence mode="popLayout">
                {operator && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-slate-400 text-2xl font-light mb-2 font-mono"
                  >
                    {prevValue} {operator}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span 
                key={display}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-slate-800 text-6xl md:text-7xl font-semibold tracking-tight font-mono"
              >
                {display}
              </motion.span>
               <span className="absolute top-4 left-6 text-[10px] uppercase tracking-widest font-bold opacity-10">precision matrix</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-4 h-full">
              <Button variant="util" onClick={handleClear} label="C" />
              <Button variant="util" onClick={handleToggleSign} label="±" />
              <Button variant="util" onClick={handlePercent} label="%" />
              <Button variant="orange" onClick={() => handleOperator('/')} icon={<Divide size={28} strokeWidth={2.5} />} />

              <Button variant="num" onClick={() => handleDigit('7')} label="7" />
              <Button variant="num" onClick={() => handleDigit('8')} label="8" />
              <Button variant="num" onClick={() => handleDigit('9')} label="9" />
              <Button variant="sky" onClick={() => handleOperator('*')} icon={<X size={28} strokeWidth={2.5} />} />

              <Button variant="num" onClick={() => handleDigit('4')} label="4" />
              <Button variant="num" onClick={() => handleDigit('5')} label="5" />
              <Button variant="num" onClick={() => handleDigit('6')} label="6" />
              <Button variant="purple" onClick={() => handleOperator('-')} icon={<Minus size={28} strokeWidth={2.5} />} />

              <Button variant="num" onClick={() => handleDigit('1')} label="1" />
              <Button variant="num" onClick={() => handleDigit('2')} label="2" />
              <Button variant="num" onClick={() => handleDigit('3')} label="3" />
              <Button variant="emerald" onClick={() => handleOperator('+')} icon={<Plus size={28} strokeWidth={2.5} />} />

              <Button variant="num" className="col-span-2" onClick={() => handleDigit('0')} label="0" />
              <Button variant="num" onClick={handleDecimal} label="." />
              <Button variant="rose" onClick={handleEqual} icon={<Equal size={32} strokeWidth={2.5} />} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant: 'num' | 'util' | 'orange' | 'sky' | 'purple' | 'emerald' | 'rose';
  className?: string;
}

function Button({ label, icon, onClick, variant, className = '' }: ButtonProps) {
  const styles = {
    num: "bg-white border-2 border-slate-100 text-slate-700 hover:border-rose-300",
    util: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    orange: "bg-orange-400 text-white hover:bg-orange-500 shadow-lg shadow-orange-200",
    sky: "bg-sky-400 text-white hover:bg-sky-500 shadow-lg shadow-sky-200",
    purple: "bg-purple-400 text-white hover:bg-purple-500 shadow-lg shadow-purple-200",
    emerald: "bg-emerald-400 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-200",
    rose: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`
        calc-btn h-16 md:h-20 rounded-3xl flex items-center justify-center 
        text-2xl font-bold transition-all
        ${styles[variant]}
        ${className}
      `}
    >
      {icon ? icon : label}
    </motion.button>
  );
}

