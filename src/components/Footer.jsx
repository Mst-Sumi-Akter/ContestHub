import React from 'react';
import logo from "../assets/logo.jpg";

const Footer = () => {
  return (
    <div className="bg-black text-white">

      {/* Top Footer */}
      <footer className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 py-12">

        <nav className="flex flex-col gap-2 text-left">
          <h6 className="text-lg font-semibold mb-3">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>

        <nav className="flex flex-col gap-2 text-left">
          <h6 className="text-lg font-semibold mb-3">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        <nav className="flex flex-col gap-2 text-left">
          <h6 className="text-lg font-semibold mb-3">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>

      </footer>

      {/* Bottom Footer */}
      <footer className="border-t border-gray-700 py-6">
        <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center">

          {/* Logo + Text */}
          <aside className="flex items-center gap-4 text-left">
            <img src={logo} alt="Company Logo" className="w-12 h-12 rounded" />
            <p className="leading-snug">
              ACME Industries Ltd. <br />
              Providing reliable tech since 1992
            </p>
          </aside>

          {/* Social Icons */}
          <nav className="flex gap-6 mt-6 md:mt-0">

            {/* LinkedIn */}
            {/* 🔵 LinkedIn */}
            <a
              href="https://www.linkedin.com/in/sumi-akter-cse/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                className="fill-current">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 
                5v14c0 2.761 2.239 5 5 
                5h14c2.761 0 5-2.239 
                5-5v-14c0-2.761-2.239-5-5-5zm-11 
                19h-3v-10h3v10zm-1.5-11.268c-.966 
                0-1.75-.79-1.75-1.764s.784-1.764 
                1.75-1.764 1.75.79 1.75 1.764-.784 
                1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.06-1.865-3.06-1.865 
                0-2.151 1.455-2.151 2.962v5.702h-3v-10h2.879v1.367h.041c.401-.761 
                1.379-1.562 2.839-1.562 3.036 0 3.6 2.006 
                3.6 4.614v5.581z"/>
              </svg>
            </a>

            {/* ⚫ GitHub */}
            <a
              href="https://github.com/Mst-Sumi-Akter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                className="fill-current">
                <path d="M12 .297c-6.63 0-12 5.373-12 
                12 0 5.303 3.438 9.8 8.205 
                11.385.6.113.82-.258.82-.577 
                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 
                1.205.084 1.84 1.237 1.84 1.237 
                1.07 1.835 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.604-2.665-.304-5.466-1.334-5.466-5.93 
                0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
                0 0 1.005-.322 3.3 1.23a11.48 
                11.48 0 0 1 3.003-.404c1.02.005 2.045.138 
                3.003.404 2.28-1.552 3.285-1.23 
                3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
                1.23 1.91 1.23 3.22 0 4.61-2.805 
                5.625-5.475 5.92.43.37.81 1.096.81 
                2.22 0 1.606-.015 2.896-.015 
                3.286 0 .315.21.69.825.57 4.765-1.59 
                8.2-6.085 8.2-11.385 
                0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* 🔵 Facebook */}
            <a
              href="https://www.facebook.com/sumi.akter.cse"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                className="fill-current border rounded-md text-black bg-white p-1">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667
                c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808
                c-3.596 0-5.192 1.583-5.192 
                4.615v3.385z"/>
              </svg>
            </a>

          </nav>
        </div>
      </footer>

    </div>
  );
};

export default Footer;
