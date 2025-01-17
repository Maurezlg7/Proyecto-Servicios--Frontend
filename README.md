# Proyecto de Gestión de Usuarios

## Changelog

### 2025-01-15

#### **Login Component**
- **Corrección de redirección tras el inicio de sesión exitoso**:
  - Se agregó el hook `useLocation` de `react-router-dom` para manejar la redirección a la ruta previa a la autenticación.
  - Ahora, el componente redirige a la ruta almacenada en `location.state?.from` o, si no está disponible, a `/profile` por defecto.

#### **Errores corregidos**
- Se corrigió un error donde los usuarios eran redirigidos únicamente al perfil, ignorando la ruta previa.

#### **Archivos afectados**
- `src/components/Login.jsx`

#### **Cómo probar los cambios**
1. Navega a una ruta protegida, como `/profile`.
2. Serás redirigido al formulario de inicio de sesión.
3. Ingresa credenciales válidas.
4. Tras iniciar sesión, deberías ser redirigido a `/profile`.


#### DEPENDENCIA NUEVA:

**npm install jwt-decode**