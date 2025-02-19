import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/tailwindcss";
import CardContainer from "../CardContianer/v3";

interface InvitationCodeModalProps {
  onSubmit: (code: string) => void;
}

export const InvitationCodeModal = ({ onSubmit }: InvitationCodeModalProps) => {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Show animation on mount
  useEffect(() => {
    setShow(true);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    setError(false);
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Add bounce animation
    setAnimateIndex(index);
    setTimeout(() => setAnimateIndex(null), 300);

    // Auto focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // If all codes are filled, submit
    if (index === 5 && value !== '') {
      const fullCode = [...newCodes.slice(0, 5), value].join('');
      if (fullCode.length === 6) {
        try {
          onSubmit(fullCode);
        } catch {
          setError(true);
          // Clear inputs on error
          setCodes(['', '', '', '', '', '']);
          inputRefs[0].current?.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setError(false);
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCodes = [...codes];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCodes[i] = pastedData[i];
    }
    
    setCodes(newCodes);
    
    if (pastedData.length === 6) {
      try {
        onSubmit(pastedData);
      } catch {
        setError(true);
        // Clear inputs on error
        setCodes(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } else {
      // Focus the next empty input after pasted data
      inputRefs[Math.min(pastedData.length, 5)].current?.focus();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn(
        "w-full max-w-[500px] mx-4 transition-all duration-500 transform",
        show ? "translate-y-0 opacity-100 shake-vertical" : "translate-y-4 opacity-0"
      )}>
        <CardContainer>
          <div className={cn(
            "w-full bg-white rounded-[24px] border-[1px] border-dashed border-black/50 mx-auto p-6 relative",
            show && "shake"
          )}>
            <div className="flex flex-col gap-6">
              <h2 className="text-black text-2xl font-bold text-center">Enter Invitation Code</h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between w-full">
                  {codes.map((code, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      maxLength={1}
                      value={code}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={cn(
                        "size-14 bg-white rounded text-center text-black text-xl outline-none transition-all duration-200 shadow-[2px_2px_0px_0px_#000000]",
                        error ? "border-[2px] border-red-500" : "border-[2px] border-black/50 focus:border-black",
                        animateIndex === index && "animate-bounce-custom"
                      )}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-red-500 text-sm text-center">
                    Invalid invitation code. Please try again.
                  </p>
                )}
                <style jsx global>{`
                  @keyframes bounce-custom {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-10px);
                    }
                  }
                  .animate-bounce-custom {
                    animation: bounce-custom 0.3s ease;
                  }
                  @keyframes shake-vertical {
                    0%, 100% { transform: translateY(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateY(-4px); }
                    20%, 40%, 60%, 80% { transform: translateY(4px); }
                  }
                  .shake-vertical {
                    animation: shake-vertical 0.8s cubic-bezier(0.36, 0, 0.66, -0.56);
                  }
                `}</style>
              </div>
              <button
                onClick={() => onSubmit(codes.join(''))}
                disabled={codes.some(code => !code)}
                className="w-full bg-gray-500 text-white font-medium rounded-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-600"
              >
                Submit
              </button>
            </div>
          </div>
        </CardContainer>
      </div>
    </div>
  );
}; 