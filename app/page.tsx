'use client'

import { useState } from 'react'
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  UserRound,
  Users,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Solicitudes', icon: ClipboardList },
  { label: 'Seguimiento', icon: BarChart3 },
  { label: 'Reportes', icon: FileText },
]

const requests = [
  { id: 'SOL-2024-001', title: 'Reparación de aire acondicionado', area: 'Aula 204', date: '12 Jun 2024', status: 'Pendiente', tone: 'orange' },
  { id: 'SOL-2024-002', title: 'Cambio de luminarias', area: 'Pasillo principal', date: '11 Jun 2024', status: 'En proceso', tone: 'blue' },
  { id: 'SOL-2024-003', title: 'Revisión de instalaciones eléctricas', area: 'Laboratorio', date: '10 Jun 2024', status: 'Completada', tone: 'green' },
]

export default function Page() {
  const [active, setActive] = useState('Dashboard')
  const [showRequest, setShowRequest] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleAuthSuccess = (user: any) => {
    setUserData(user)
    setAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthenticated(false)
      setUserData(null)
      setActive('Dashboard')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (!authenticated) {
    return <AuthScreen mode={authMode} onModeChange={setAuthMode} onSuccess={handleAuthSuccess} />
  }

  const userInitials = userData?.nombre 
    ? userData.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US'
  const userName = userData?.nombre || 'Usuario'
  const userRole = userData?.puesto || 'Usuario'

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div>
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setMenuOpen(false) }}>
              <Icon size={18} strokeWidth={2.1} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18} /><span>Configuración</span></button>
          <button className="nav-item" onClick={handleLogout}><LogOut size={18} /><span>Cerrar sesión</span></button>
          <div className="profile"><div className="avatar">{userInitials}</div><div><strong>{userName}</strong><small>{userRole}</small></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Inicio</span><span>/</span><strong>{active}</strong></div>
          <div className="top-actions"><button className="icon-button" aria-label="Buscar"><Search size={18} /></button><button className="icon-button notification" aria-label="Notificaciones"><Bell size={18} /><i /></button><div className="top-user"><div className="avatar small">{userInitials}</div><span>{userName}</span><ChevronDown size={14} /></div></div>
        </header>

        <div className="page-body">
          <div className="welcome-row"><div><p className="eyebrow">MIÉRCOLES, 12 DE JUNIO DE 2024</p><h1>{active === 'Dashboard' ? `Buenos días, ${userName.split(' ')[0]}` : active}</h1><p className="subtitle">Gestiona el mantenimiento de tu institución de forma sencilla.</p></div><button className="primary-button" onClick={() => setShowRequest(true)}><Plus size={18} /> Nueva solicitud</button></div>

          {active === 'Dashboard' ? <>
            <div className="stats-grid"><Stat icon={ClipboardList} label="Solicitudes totales" value="128" detail="+12% vs. mes anterior" tone="orange" /><Stat icon={CalendarDays} label="Pendientes" value="24" detail="8 requieren atención" tone="yellow" /><Stat icon={Check} label="Completadas" value="96" detail="+18% vs. mes anterior" tone="green" /><Stat icon={Users} label="Proveedores activos" value="18" detail="3 nuevos este mes" tone="blue" /></div>
            <div className="section-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h2>Solicitudes por estado</h2><p>Resumen del último periodo</p></div><button className="select-button">Este mes <ChevronDown size={14} /></button></div><div className="chart"><div className="chart-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="bars"><div className="bar-group"><div className="bar completed" style={{ height: '82%' }} /><div className="bar process" style={{ height: '48%' }} /><div className="bar pending" style={{ height: '25%' }} /><small>Mar</small></div><div className="bar-group"><div className="bar completed" style={{ height: '68%' }} /><div className="bar process" style={{ height: '55%' }} /><div className="bar pending" style={{ height: '34%' }} /><small>Abr</small></div><div className="bar-group"><div className="bar completed" style={{ height: '92%' }} /><div className="bar process" style={{ height: '38%' }} /><div className="bar pending" style={{ height: '44%' }} /><small>May</small></div><div className="bar-group"><div className="bar completed" style={{ height: '78%' }} /><div className="bar process" style={{ height: '51%' }} /><div className="bar pending" style={{ height: '31%' }} /><small>Jun</small></div></div></div><div className="legend"><span><i className="dot green" />Completadas</span><span><i className="dot blue" />En proceso</span><span><i className="dot orange" />Pendientes</span></div></div><div className="panel quick-panel"><div className="panel-heading"><div><h2>Acciones rápidas</h2><p>Accede a las funciones más utilizadas</p></div></div><Quick icon={ClipboardList} title="Ver solicitudes" text="Consulta y gestiona todas las solicitudes" onClick={() => setActive('Solicitudes')} /><Quick icon={Plus} title="Crear solicitud" text="Registra una nueva solicitud de mantenimiento" onClick={() => setShowRequest(true)} /><Quick icon={BarChart3} title="Ver reportes" text="Analiza el rendimiento del mantenimiento" onClick={() => setActive('Reportes')} /></div></div>
            <div className="panel recent-panel"><div className="panel-heading"><div><h2>Solicitudes recientes</h2><p>Las últimas solicitudes registradas en el sistema</p></div><button className="text-button" onClick={() => setActive('Solicitudes')}>Ver todas <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>ID SOLICITUD</th><th>DESCRIPCIÓN</th><th>UBICACIÓN</th><th>FECHA</th><th>ESTADO</th></tr></thead><tbody>{requests.map((item) => <tr key={item.id}><td className="muted">{item.id}</td><td className="strong">{item.title}</td><td>{item.area}</td><td>{item.date}</td><td><span className={`status ${item.tone}`}>{item.status}</span></td></tr>)}</tbody></table></div></div>
          </> : <div className="panel empty-state"><div className="empty-icon"><FileText size={25} /></div><h2>{active}</h2><p>Esta sección está lista para gestionar la información de mantenimiento.</p><button className="primary-button" onClick={() => setActive('Dashboard')}>Volver al dashboard</button></div>}
        </div>
      </section>
      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </main>
  )
}

function AuthScreen({ mode, onModeChange, onSuccess }: { mode: 'login' | 'register'; onModeChange: (mode: 'login' | 'register') => void; onSuccess: (userData: any) => void }) {
  const isRegister = mode === 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    
    try {
      if (isRegister) {
        // Registro de usuario
        const nombre = formData.get('nombre') as string
        const telefono = formData.get('telefono') as string
        const correo = formData.get('correo') as string
        const puesto = formData.get('puesto') as string
        const contrasena = formData.get('contrasena') as string
        const confirmarContrasena = formData.get('confirmarContrasena') as string

        // Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
          setError('Las contraseñas no coinciden')
          setLoading(false)
          return
        }

        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, telefono, correo, puesto, contrasena }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Error al crear la cuenta')
          setLoading(false)
          return
        }

        // Después de registrarse, hacer login automáticamente
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena }),
        })

        const loginData = await loginResponse.json()

        if (!loginResponse.ok) {
          setError('Cuenta creada. Por favor inicia sesión.')
          setLoading(false)
          onModeChange('login')
          return
        }

        onSuccess(loginData.usuario)
      } else {
        // Login
        const correo = formData.get('correo') as string
        const contrasena = formData.get('contrasena') as string

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Error al iniciar sesión')
          setLoading(false)
          return
        }

        onSuccess(data.usuario)
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  return <main className="auth-shell"><section className="auth-card"><div className="auth-brand"><div className="brand-mark">M</div><div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div></div><div className="auth-copy"><p className="eyebrow">PLATAFORMA DE MANTENIMIENTO</p><h1>{isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1><p>{isRegister ? 'Registra tu institución para comenzar a gestionar el mantenimiento.' : 'Ingresa a tu cuenta para continuar gestionando tu institución.'}</p></div><form className={`auth-form ${isRegister ? 'register-form' : ''}`} onSubmit={handleSubmit}>{error && <div style={{ padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '6px', color: '#c33', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}{isRegister ? <><label>Nombre completo<input name="nombre" required placeholder="Ej. Juan Pérez" disabled={loading} /></label><label>Teléfono<input name="telefono" required placeholder="9991234567" pattern="\d{10}" title="Debe tener 10 dígitos" disabled={loading} /></label><label>Correo electrónico<input name="correo" required type="email" placeholder="juan@escuela.com" disabled={loading} /></label><label>Puesto<input name="puesto" required placeholder="Ej. Docente" disabled={loading} /></label><label>Contraseña<input name="contrasena" required type="password" placeholder="••••••••" minLength={8} disabled={loading} /></label><label>Confirmar contraseña<input name="confirmarContrasena" required type="password" placeholder="••••••••" minLength={8} disabled={loading} /></label></> : <><label>Correo electrónico<input name="correo" required type="email" placeholder="juan@escuela.com" disabled={loading} /></label><label>Contraseña<input name="contrasena" required type="password" placeholder="••••••••" disabled={loading} /></label><div className="auth-options"><label className="check-label"><input type="checkbox" disabled={loading} /> Recordarme</label></div></>}<button className="primary-button auth-submit" type="submit" disabled={loading}>{loading ? 'Procesando...' : (isRegister ? 'Crear cuenta' : 'Iniciar sesión')}</button></form><p className="auth-switch">{isRegister ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'} <button type="button" className="link-button" onClick={() => { onModeChange(isRegister ? 'login' : 'register'); setError('') }}>{isRegister ? 'Inicia sesión' : 'Regístrate'}</button></p><p className="auth-footer">Mante<span>ni+</span> Escolar · Gestión simple y eficiente</p></section></main>}

function Stat({ icon: Icon, label, value, detail, tone }: { icon: typeof Home; label: string; value: string; detail: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><small className={tone === 'orange' || tone === 'green' ? 'positive' : ''}>{detail}</small></div></div> }
function Quick({ icon: Icon, title, text, onClick }: { icon: typeof Home; title: string; text: string; onClick: () => void }) { return <button className="quick-action" onClick={onClick}><span className="quick-icon"><Icon size={18} /></span><span><strong>{title}</strong><small>{text}</small></span><span className="arrow">→</span></button> }
function RequestModal({ onClose }: { onClose: () => void }) { return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><button className="close-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button><div className="modal-brand"><div className="brand-mark">M</div><div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div></div><p className="eyebrow">NUEVA SOLICITUD</p><h2>Crear solicitud</h2><p className="modal-subtitle">Registra una nueva solicitud de mantenimiento.</p><label>Descripción<input placeholder="Describe el problema o solicitud" /></label><div className="form-row"><label>Ubicación<input placeholder="Ej. Aula 204" /></label><label>Prioridad<select defaultValue="Media"><option>Baja</option><option>Media</option><option>Alta</option></select></label></div><label>Detalles adicionales<textarea placeholder="Añade información que pueda ayudar..." rows={3} /></label><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={onClose}>Crear solicitud</button></div></div></div> }
