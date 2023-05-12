import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import store from 'store';
import agent from "../../Agent";
import KiteLogo from '../../assets/kite.png';
import Button from "../../components/Button";
import EyeOpen from "../../assets/eye-open.svg";
import EyeClosed from "../../assets/eye-closed.svg";

export default function Login(props: {}) {
    const [form, setForm] = useState({
        identifier: '',
        password: '',
        loading: false,
        error: null,
        service: ''
    });
    const [advanced, setAdvanced] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const theme = store.get("theme");
    const navigate = useNavigate();

    useEffect(() => {
        if (theme == 'dark') {
            document.body.classList.add('dark');
        }
    }, []);

    const _handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.identifier.length || !form.password.length) return;
        setForm(prev => ({ ...prev, loading: true }));
        try {
            if (form.service.length) {
                if (!form.service.startsWith('https://')) {
                    // @ts-ignore
                    setForm(prev => ({ ...prev, error: "Service Url is not valid" }));
                    return;
                }
                // @ts-ignore
                agent.changeService(form.service);
            }

            const result = await agent.login({
                identifier: form.identifier.includes(".") ? form.identifier : `${form.identifier}.bsky.social`,
                password: form.password
            });
            if (result.success) {
                navigate("/");
            }

        } catch (err: any) {
            console.error(err.message);
            setForm(prev => ({ ...prev, error: err.message, loading: false }));
        }
    }

    const _handleServiceChange = (e: any) => {
        setForm(prev => ({ ...prev, service: e.target.value }));
    };

    return (
        <div className="login-page">
            <img src={KiteLogo} alt="Kite | A Better BlueSky Client" />
            <h1>Kite</h1>
            <h2>Better BlueSky Client</h2>
            <form onSubmit={_handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" placeholder="Identifier ( ex: arta.bsky.social or arta )" value={form.identifier} onChange={e => setForm(prev => ({ ...prev, identifier: e.target.value }))} />
                </div>
                <div className="input-wrapper">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
                    <img src={showPassword ? EyeOpen : EyeClosed} alt="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} />
                </div>
                {advanced ? <div className="input-wrapper">
                    <input type="text" placeholder="Service URL, Leave empty if you don't know what this is" value={form.service} onChange={_handleServiceChange} />
                </div> : 
                    <strong style={{display:'block', marginBottom:'2rem'}} className="text-grey pointer" onClick={() => setAdvanced(true)}>+ Advanced</strong>
                }
                <Button text="Login" className="btn" loading={form.loading} />
                <Button onClick={() => navigate('/register')} text="Register" className="btn outline" />
                {form.error ? <p className="error text-center">{form.error}</p> : ''}
            </form>
        </div>
    );
}