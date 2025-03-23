function Error({ statusCode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: 'white',
      backgroundColor: '#121212',
    }}>
      <h1 style={{
        fontSize: '2rem',
        background: 'linear-gradient(to right, #0070f3, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {statusCode
          ? `Error: ${statusCode}`
          : 'Application Error'}
      </h1>
      <p>Something went wrong</p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
