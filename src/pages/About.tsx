function About() {
  return (
    <div className='p-4 text-blue-600 bg-gray-100 rounded-lg'>
      <h1 className='text-2xl font-bold'>About Page</h1>
      <p>HMR + React Compiler Configuration ✅</p>
      <p className='text-sm text-gray-600 mt-2'>
        Development: HMR enabled, no React Compiler
        <br />
        Production: React Compiler enabled, optimized builds
      </p>
    </div>
  );
}

export default About;
