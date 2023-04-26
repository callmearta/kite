import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../Agent";
import Button from "../../components/Button";

export default function Login(props: {}) {
    const [form, setForm] = useState({
        identifier: '',
        password: '',
        loading: false
    });
    const navigate = useNavigate();

    const _handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form.identifier.length || !form.password.length) return;
        setForm(prev => ({ ...prev, loading: true }));
        try {
            const result = await agent.login({
                identifier: form.identifier.includes(".bsky.") ? form.identifier : `${form.identifier}.bsky.social`,
                password: form.password
            });
            if (result.success) {
                navigate("/");
            }

        } catch (err) {
            window.location.reload();
            setForm(prev => ({ ...prev, loading: false }));
        }
    }

    return (
        <div className="login-page">
            <img src="/kite.png" />
            <h1>Kite</h1>
            <h2>Better BlueSky Client</h2>
            <form onSubmit={_handleSubmit}>
                <div className="input-wrapper">
                    <input type="text" placeholder="Identifier ( ex: arta.bsky.social or arta )" value={form.identifier} onChange={e => setForm(prev => ({ ...prev, identifier: e.target.value }))} />
                </div>
                <div className="input-wrapper">
                    <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} />
                </div>
                <Button text="Login" className="btn" loading={form.loading} />
            </form>
        </div>
    );
}