import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    
    const variants: Record<string, string> = {
      default: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-md",
      outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
      secondary: "bg-white/10 text-white hover:bg-white/20",
      ghost: "hover:bg-white/10 text-slate-300 hover:text-white",
      destructive: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
      link: "text-emerald-400 underline-offset-4 hover:underline"
    };

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      xs: "h-7 px-2.5 text-xs",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-2"
    };

    const combinedClassName = `${baseStyle} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;

    return <button ref={ref} className={combinedClassName} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };

