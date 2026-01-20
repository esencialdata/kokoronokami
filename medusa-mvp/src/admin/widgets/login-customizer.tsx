import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"
import "./login-customizer.css"
// @ts-ignore
import Logo from "../assets/simbolo-esencial_b.svg"

const LoginCustomizer = () => {
    useEffect(() => {
        // Force Dark Mode
        if (typeof document !== "undefined") {
            document.documentElement.classList.add("dark")
        }

        // TEXT OVERRIDE FALLBACK
        // Sometimes i18n fails or loads late. This ensures our text is always shown.
        const interval = setInterval(() => {
            const headings = document.querySelectorAll('h1, h2, p, span, div');
            headings.forEach(el => {
                if (el.textContent?.trim() === "Welcome to Medusa") {
                    el.textContent = "Bienvenido a Esencial Shop";
                }
                if (el.textContent?.trim() === "Sign in to access the account area") {
                    el.textContent = "Inicia sesión para administrar tu tienda";
                }
            });
        }, 100);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="custom-branding flex flex-col items-center mb-6">
            {/* Logo Box */}
            <div className="bg-ui-button-neutral shadow-buttons-neutral after:button-neutral-gradient relative flex h-[64px] w-[64px] items-center justify-center rounded-xl after:inset-0 after:content-[''] custom-logo-wrapper mb-4">
                <img src={Logo} alt="Esencial Shop" className="custom-logo" style={{ height: "40px", width: "auto", display: "block" }} />
            </div>

            {/* Custom Welcome Text */}
            <div className="flex flex-col items-center text-center">
                <h1 className="text-ui-fg-base txt-compact-large-plus mb-1 font-medium">Bienvenido a Esencial Shop</h1>
                <p className="text-ui-fg-subtle txt-small">Inicia sesión para administrar tu tienda</p>
            </div>
        </div>
    )
}

export const config = defineWidgetConfig({
    zone: "login.before",
})

export default LoginCustomizer
