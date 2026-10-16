'use client'

import { useState, useEffect } from 'react'
import {
  AlertCircle,
  BarChart3,
  Bell,
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
  Users,
  X,
} from 'lucide-react'

// ── Tipos ────────────────────────────────────────────────────────────────────

interface Solicitud {
  id: number
  nombre: string
  descripcion: string
  prioridad: 'ROJO' | 'NARANJA' | 'VERDE'
  estado: 'PENDIENTE'
  ubicacion: { edificio: string; area: string }
  autor: string
  fechaCreacion: string
}

interface Ubicacion {
  id: number
  edificio: string
}

interface AutorInfo {
  nombre: string
  telefono: string
  puesto: string
}

// Roles con permiso de consultar datos del autor
const ROLES_AUTORIZADOS_AUTOR = ['Encargado de mantenimiento', 'Administrador']

// ── Constantes ────────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Solicitudes', icon: ClipboardList },
  { label: 'Seguimiento', icon: BarChart3 },
  { label: 'Reportes', icon: FileText },
]

const PRIORIDAD_CONFIG = {
  ROJO:    { label: 'Urgente (Rojo)',     dot: '#ef4444' },
  NARANJA: { label: 'Moderado (Naranja)', dot: '#f97316' },
  VERDE:   { label: 'Bajo (Verde)',       dot: '#22c55e' },
} as const

// ── Página principal ──────────────────────────────────────────────────────────

export default function Page() {
  const [active, setActive]               = useState('Dashboard')
  const [showRequest, setShowRequest]     = useState(false)
  const [menuOpen, setMenuOpen]           = useState(false)
  const [authMode, setAuthMode]           = useState<'login' | 'register'>('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [userData, setUserData]           = useState<any>(null)
  const [solicitudes, setSolicitudes]     = useState<Solicitud[]>([])
  const [autorModal, setAutorModal]       = useState<{ solicitudId: number; nombre: string } | null>(null)

  const handleAuthSuccess = (user: any) => {
    setUserData(user)
    setAuthenticated(true)
    fetch('/api/solicitudes')
      .then(r => (r.ok ? r.json() : []))
      .then((data: Solicitud[]) => setSolicitudes(data))
      .catch(() => setSolicitudes([]))
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthenticated(false)
      setUserData(null)
      setActive('Dashboard')
      setSolicitudes([])
      setAutorModal(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleSolicitudCreada = (nueva: Solicitud) => {
    setSolicitudes(prev => [nueva, ...prev])
    setShowRequest(false)
  }

  if (!authenticated) {
    return <AuthScreen mode={authMode} onModeChange={setAuthMode} onSuccess={handleAuthSuccess} />
  }

  const userInitials = userData?.nombre
    ? userData.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'US'
  const userName = userData?.nombre || 'Usuario'
  const userRole = userData?.puesto  || 'Usuario'

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div>
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? 'active' : ''}`}
              onClick={() => { setActive(label); setMenuOpen(false) }}>
              <Icon size={18} strokeWidth={2.1} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={18} /><span>Configuración</span></button>
          <button className="nav-item" onClick={handleLogout}><LogOut size={18} /><span>Cerrar sesión</span></button>
          <div className="profile">
            <div className="avatar">{userInitials}</div>
            <div><strong>{userName}</strong><small>{userRole}</small></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Inicio</span><span>/</span><strong>{active}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar"><Search size={18} /></button>
            <button className="icon-button notification" aria-label="Notificaciones"><Bell size={18} /><i /></button>
            <div className="top-user"><div className="avatar small">{userInitials}</div><span>{userName}</span><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-body">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">MANTENI+ ESCOLAR</p>
              <h1>{active === 'Dashboard' ? `Buenos días, ${userName.split(' ')[0]}` : active}</h1>
              <p className="subtitle">Gestiona el mantenimiento de tu institución de forma sencilla.</p>
            </div>
            <button className="primary-button" id="btn-nueva-solicitud" onClick={() => setShowRequest(true)}>
              <Plus size={18} /> Nueva solicitud
            </button>
          </div>

          {active === 'Dashboard' && (
            <DashboardView solicitudes={solicitudes} setActive={setActive} setShowRequest={setShowRequest} />
          )}

          {active === 'Solicitudes' && (
            <SolicitudesView
              solicitudes={solicitudes}
              setShowRequest={setShowRequest}
              userRole={userRole}
              onVerAutor={(id, nombre) => setAutorModal({ solicitudId: id, nombre })}
            />
          )}

          {(active === 'Seguimiento' || active === 'Reportes') && (
            <div className="panel empty-state">
              <div className="empty-icon"><FileText size={25} /></div>
              <h2>{active}</h2>
              <p>Esta sección está lista para gestionar la información de mantenimiento.</p>
              <button className="primary-button" onClick={() => setActive('Dashboard')}>Volver al dashboard</button>
            </div>
          )}
        </div>
      </section>

      {showRequest && (
        <RequestModal
          onClose={() => setShowRequest(false)}
          onCreated={handleSolicitudCreada}
        />
      )}

      {autorModal && (
        <AutorModal
          solicitudId={autorModal.solicitudId}
          solicitudNombre={autorModal.nombre}
          onClose={() => setAutorModal(null)}
        />
      )}
    </main>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardView({ solicitudes, setActive, setShowRequest }: {
  solicitudes: Solicitud[]
  setActive: (s: string) => void
  setShowRequest: (v: boolean) => void
}) {
  const recientes = solicitudes.slice(0, 5)

  return (
    <>
      <div className="stats-grid">
        <Stat icon={ClipboardList} label="Solicitudes totales"  value={String(solicitudes.length)} detail="Registradas en el sistema" tone="orange" />
        <Stat icon={CalendarDays}  label="Pendientes"           value={String(solicitudes.filter(s => s.estado === 'PENDIENTE').length)} detail="Por atender" tone="yellow" />
        <Stat icon={Check}         label="Urgentes (Rojo)"      value={String(solicitudes.filter(s => s.prioridad === 'ROJO').length)} detail="Atención inmediata" tone="green" />
        <Stat icon={Users}         label="Esta sesión"          value={String(solicitudes.length)} detail="Solicitudes creadas" tone="blue" />
      </div>

      <div className="section-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <div><h2>Solicitudes recientes</h2><p>Últimas registradas en el sistema</p></div>
            <button className="text-button" onClick={() => setActive('Solicitudes')}>Ver todas <span>→</span></button>
          </div>
          {recientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#8e98a6', fontSize: '13px' }}>
              <ClipboardList size={32} style={{ opacity: .3, marginBottom: 10 }} />
              <p>Aún no hay solicitudes. ¡Crea la primera!</p>
            </div>
          ) : (
            <div className="table-wrap" style={{ marginTop: 20 }}>
              <table>
                <thead>
                  <tr><th>NOMBRE</th><th>UBICACIÓN</th><th>PRIORIDAD</th><th>ESTADO</th></tr>
                </thead>
                <tbody>
                  {recientes.map(s => (
                    <tr key={s.id}>
                      <td className="strong">{s.nombre}</td>
                      <td>{s.ubicacion.edificio} · {s.ubicacion.area}</td>
                      <td><PrioridadBadge p={s.prioridad} /></td>
                      <td><span className="status orange">Pendiente</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel quick-panel">
          <div className="panel-heading">
            <div><h2>Acciones rápidas</h2><p>Accede a las funciones más utilizadas</p></div>
          </div>
          <Quick icon={ClipboardList} title="Ver solicitudes" text="Consulta y gestiona todas las solicitudes" onClick={() => setActive('Solicitudes')} />
          <Quick icon={Plus}          title="Crear solicitud" text="Registra una nueva solicitud de mantenimiento" onClick={() => setShowRequest(true)} />
          <Quick icon={BarChart3}     title="Ver reportes"    text="Analiza el rendimiento del mantenimiento" onClick={() => setActive('Reportes')} />
        </div>
      </div>
    </>
  )
}

// ── Vista Solicitudes ─────────────────────────────────────────────────────────

function SolicitudesView({ solicitudes, setShowRequest, userRole, onVerAutor }: {
  solicitudes: Solicitud[]
  setShowRequest: (v: boolean) => void
  userRole: string
  onVerAutor: (id: number, nombre: string) => void
}) {
  const puedeVerAutor = ROLES_AUTORIZADOS_AUTOR.includes(userRole)
  return (
    <div className="panel" style={{ marginTop: 0 }}>
      <div className="panel-heading">
        <div>
          <h2>Todas las solicitudes</h2>
          <p>{solicitudes.length} registradas en el sistema</p>
        </div>
        <button className="primary-button" id="btn-sol-nueva" onClick={() => setShowRequest(true)}>
          <Plus size={15} /> Nueva solicitud
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="empty-state" style={{ minHeight: 280 }}>
          <div className="empty-icon"><ClipboardList size={25} /></div>
          <h2>Sin solicitudes</h2>
          <p>Registra el primer problema detectado en la institución.</p>
          <button className="primary-button" onClick={() => setShowRequest(true)}>
            <Plus size={15} /> Nueva solicitud
          </button>
        </div>
      ) : (
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>DESCRIPCIÓN</th>
                <th>EDIFICIO</th>
                <th>ÁREA</th>
                <th>PRIORIDAD</th>
                <th>AUTOR</th>
                <th>FECHA</th>
                <th>ESTADO</th>
                    {puedeVerAutor && <th>ACCIONES</th>}
                  </tr>
                </thead>
            <tbody>
              {solicitudes.map(s => (
                <tr key={s.id}>
                  <td className="muted">#{s.id}</td>
                  <td className="strong">{s.nombre}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.descripcion}</td>
                  <td>{s.ubicacion.edificio}</td>
                  <td>{s.ubicacion.area}</td>
                  <td><PrioridadBadge p={s.prioridad} /></td>
                  <td>{s.autor}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{s.fechaCreacion.replace('T', ' ')}</td>
                    <td><span className="status orange">Pendiente</span></td>
                      {puedeVerAutor && (
                        <td>
                          <button
                            id={`btn-ver-autor-${s.id}`}
                            onClick={() => onVerAutor(s.id, s.nombre)}
                            style={{
                              padding: '4px 10px', border: '1px solid #2b3a5a', borderRadius: 6,
                              background: '#0d1a30', color: '#608bf5', fontSize: 10, fontWeight: 700,
                              cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                          >
                            Ver autor
                          </button>
                        </td>
                      )}
                    </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Modal Datos del Autor ─────────────────────────────────────────────────────

function AutorModal({ solicitudId, solicitudNombre, onClose }: {
  solicitudId: number
  solicitudNombre: string
  onClose: () => void
}) {
  const [autor, setAutor]     = useState<AutorInfo | null>(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/solicitudes/${solicitudId}/autor`)
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'No se pudo consultar el autor')
        setAutor(data as AutorInfo)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [solicitudId])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="autor-title">
      <div className="modal" style={{ width: 'min(480px,100%)' }}>
        <button className="close-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        <p className="eyebrow">AUTOR DE LA SOLICITUD</p>
        <h2 id="autor-title" style={{ margin: '0 0 16px' }}>{solicitudNombre}</h2>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}
        {autor && (
          <dl style={{ display: 'grid', gap: 12, margin: 0 }}>
            <div><dt style={{ color: '#a9b0bb', fontSize: 11 }}>Nombre</dt><dd style={{ margin: 0 }}>{autor.nombre}</dd></div>
            <div><dt style={{ color: '#a9b0bb', fontSize: 11 }}>Teléfono</dt><dd style={{ margin: 0 }}>{autor.telefono}</dd></div>
            <div><dt style={{ color: '#a9b0bb', fontSize: 11 }}>Puesto</dt><dd style={{ margin: 0 }}>{autor.puesto}</dd></div>
          </dl>
        )}
      </div>
    </div>
  )
}

// ── Modal Nueva Solicitud ─────────────────────────────────────────────────────

function RequestModal({ onClose, onCreated }: {
  onClose: () => void
  onCreated: (s: Solicitud) => void
}) {
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([])
  const [loadingUbic, setLoadingUbic] = useState(true)

  const [nombre, setNombre]       = useState('')
  const [descripcion, setDesc]    = useState('')
  const [prioridad, setPrioridad] = useState<'ROJO' | 'NARANJA' | 'VERDE'>('VERDE')
  const [edificio, setEdificio]   = useState('')
  const [area, setArea]           = useState('')

  // US-04: Carga el catálogo de ubicaciones desde GET /api/ubicaciones
  useEffect(() => {
    fetch('/api/ubicaciones')
      .then(r => r.json())
      .then((data: Ubicacion[]) => {
        setUbicaciones(data)
        if (data.length > 0) setEdificio(data[0].edificio)
      })
      .catch(() => setError('No se pudo cargar el catálogo de ubicaciones.'))
      .finally(() => setLoadingUbic(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // US-03: Envía el formulario a POST /api/solicitudes
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          prioridad,
          ubicacion: { edificio, area },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear la solicitud')
        setLoading(false)
        return
      }

      onCreated(data as Solicitud)
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', marginTop: 8, padding: '0 12px', height: 42,
    border: '1px solid #323945', borderRadius: 9, outline: 0,
    color: '#dde1e6', background: '#0b0f14', fontSize: 12,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#a9b0bb', fontSize: 11, fontWeight: 600, marginTop: 20,
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" style={{ maxHeight: '92vh', overflowY: 'auto', width: 'min(640px,100%)' }}>
        <button className="close-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>

        <div className="modal-brand">
          <div className="brand-mark">M</div>
          <div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div>
        </div>

        <p className="eyebrow">NUEVA SOLICITUD</p>
        <h2 id="modal-title" style={{ margin: '0 0 4px' }}>Registrar problema</h2>
        <p className="modal-subtitle">Indica el problema detectado y su ubicación para que sea atendido.</p>

        {error && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '11px 14px', background: '#1f0d0d', border: '1px solid #5a1a1a', borderRadius: 8, color: '#f87171', fontSize: 13, marginTop: 18 }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Nombre ── */}
          <label style={labelStyle}>
            Nombre del problema <span style={{ color: '#ef4444' }}>*</span>
            <input
              id="sol-nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Fuga de agua en baño"
              maxLength={100}
              disabled={loading}
              required
              style={inputStyle}
            />
            <span style={{ fontSize: 10, color: nombre.length > 80 ? '#f97316' : '#66717e', display: 'block', marginTop: 4, textAlign: 'right' }}>
              {nombre.length}/100
            </span>
          </label>

          {/* ── Descripción ── */}
          <label style={labelStyle}>
            Descripción <span style={{ color: '#ef4444' }}>*</span>
            <textarea
              id="sol-descripcion"
              value={descripcion}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe el problema con detalle para que el personal pueda atenderlo..."
              rows={3}
              disabled={loading}
              required
              style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical' }}
            />
          </label>

          {/* ── Prioridad ── */}
          <label style={labelStyle}>
            Prioridad <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 8 }}>
            {(['ROJO', 'NARANJA', 'VERDE'] as const).map(p => (
              <button
                key={p}
                id={`sol-prioridad-${p.toLowerCase()}`}
                type="button"
                onClick={() => setPrioridad(p)}
                disabled={loading}
                style={{
                  padding: '10px 6px', borderRadius: 9,
                  border: `1.5px solid ${prioridad === p ? PRIORIDAD_CONFIG[p].dot : '#323945'}`,
                  background: prioridad === p ? `${PRIORIDAD_CONFIG[p].dot}18` : '#0b0f14',
                  color: prioridad === p ? PRIORIDAD_CONFIG[p].dot : '#8e98a6',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  transition: 'all .15s',
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: PRIORIDAD_CONFIG[p].dot, display: 'block' }} />
                {PRIORIDAD_CONFIG[p].label}
              </button>
            ))}
          </div>

          {/* ── Ubicación ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
            <label style={{ ...labelStyle, marginTop: 0 }}>
              Edificio / Zona <span style={{ color: '#ef4444' }}>*</span>
              <select
                id="sol-edificio"
                value={edificio}
                onChange={e => setEdificio(e.target.value)}
                disabled={loading || loadingUbic}
                required
                style={{ ...inputStyle }}
              >
                {loadingUbic && <option value="">Cargando...</option>}
                {ubicaciones.map(u => (
                  <option key={u.id} value={u.edificio}>{u.edificio}</option>
                ))}
              </select>
            </label>

            <label style={{ ...labelStyle, marginTop: 0 }}>
              Área específica <span style={{ color: '#ef4444' }}>*</span>
              <input
                id="sol-area"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="Ej. Baño planta baja"
                disabled={loading}
                required
                style={inputStyle}
              />
            </label>
          </div>

          <div className="modal-actions" style={{ marginTop: 28 }}>
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button id="btn-submit-solicitud" type="submit" className="primary-button" disabled={loading || loadingUbic}>
              {loading ? 'Registrando...' : <><Plus size={15} /> Registrar problema</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Auth Screen ───────────────────────────────────────────────────────────────

function AuthScreen({ mode, onModeChange, onSuccess }: {
  mode: 'login' | 'register'
  onModeChange: (mode: 'login' | 'register') => void
  onSuccess: (userData: any) => void
}) {
  const isRegister = mode === 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)

    try {
      if (isRegister) {
        const nombre    = formData.get('nombre')    as string
        const telefono  = formData.get('telefono')  as string
        const correo    = formData.get('correo')    as string
        const puesto    = formData.get('puesto')    as string
        const contrasena           = formData.get('contrasena')           as string
        const confirmarContrasena  = formData.get('confirmarContrasena')  as string

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
        const correo    = formData.get('correo')    as string
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

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">M</div>
          <div><div className="brand-name"><span>Mante</span><b>ni+</b></div><small>Escolar</small></div>
        </div>
        <div className="auth-copy">
          <p className="eyebrow">PLATAFORMA DE MANTENIMIENTO</p>
          <h1>{isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h1>
          <p>{isRegister ? 'Registra tu institución para comenzar a gestionar el mantenimiento.' : 'Ingresa a tu cuenta para continuar gestionando tu institución.'}</p>
        </div>
        <form className={`auth-form ${isRegister ? 'register-form' : ''}`} onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: '12px', background: '#1f0d0d', border: '1px solid #5a1a1a', borderRadius: '6px', color: '#f87171', fontSize: '13px', marginBottom: '16px', gridColumn: '1 / -1' }}>
              {error}
            </div>
          )}
          {isRegister ? (
            <>
              <label>Nombre completo<input name="nombre" required placeholder="Ej. Juan Pérez" disabled={loading} /></label>
              <label>Teléfono<input name="telefono" required placeholder="9991234567" pattern="\d{10}" title="Debe tener 10 dígitos" disabled={loading} /></label>
              <label>Correo electrónico<input name="correo" required type="email" placeholder="juan@escuela.com" disabled={loading} /></label>
              <label>Puesto
                <select name="puesto" required defaultValue="" disabled={loading}>
                  <option value="" disabled>Selecciona tu puesto</option>
                  <option value="Encargado de mantenimiento">Mantenimiento</option>
                  <option value="Docente">Docente</option>
                  <option value="Alumno">Alumno</option>
                </select>
              </label>
              <label>Contraseña<input name="contrasena" required type="password" placeholder="••••••••" minLength={8} disabled={loading} /></label>
              <label>Confirmar contraseña<input name="confirmarContrasena" required type="password" placeholder="••••••••" minLength={8} disabled={loading} /></label>
            </>
          ) : (
            <>
              <label>Correo electrónico<input name="correo" required type="email" placeholder="juan@escuela.com" disabled={loading} /></label>
              <label>Contraseña<input name="contrasena" required type="password" placeholder="••••••••" disabled={loading} /></label>
              <div className="auth-options">
                <label className="check-label"><input type="checkbox" disabled={loading} /> Recordarme</label>
              </div>
            </>
          )}
          <button className="primary-button auth-submit" type="submit" disabled={loading}>
            {loading ? 'Procesando...' : (isRegister ? 'Crear cuenta' : 'Iniciar sesión')}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'}{' '}
          <button type="button" className="link-button" onClick={() => { onModeChange(isRegister ? 'login' : 'register'); setError('') }}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
        <p className="auth-footer">Mante<span>ni+</span> Escolar · Gestión simple y eficiente</p>
      </section>
    </main>
  )
}

// ── Componentes pequeños ──────────────────────────────────────────────────────

function Stat({ icon: Icon, label, value, detail, tone }: {
  icon: typeof Home; label: string; value: string; detail: string; tone: string
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <div><p>{label}</p><strong>{value}</strong><small className={tone === 'orange' || tone === 'green' ? 'positive' : ''}>{detail}</small></div>
    </div>
  )
}

function Quick({ icon: Icon, title, text, onClick }: {
  icon: typeof Home; title: string; text: string; onClick: () => void
}) {
  return (
    <button className="quick-action" onClick={onClick}>
      <span className="quick-icon"><Icon size={18} /></span>
      <span><strong>{title}</strong><small>{text}</small></span>
      <span className="arrow">→</span>
    </button>
  )
}

function PrioridadBadge({ p }: { p: 'ROJO' | 'NARANJA' | 'VERDE' }) {
  const styles: Record<string, React.CSSProperties> = {
    ROJO:    { color: '#f87171', background: '#1f0d0d', border: '1px solid #3d1515' },
    NARANJA: { color: '#fb923c', background: '#1c1107', border: '1px solid #3d2208' },
    VERDE:   { color: '#4ade80', background: '#0d1f12', border: '1px solid #123520' },
  }
  const dot: Record<string, string> = { ROJO: '#ef4444', NARANJA: '#f97316', VERDE: '#22c55e' }
  return (
    <span style={{ padding: '4px 9px', borderRadius: 5, fontSize: 9, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5, ...styles[p] }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot[p], display: 'inline-block' }} />
      {p}
    </span>
  )
}
