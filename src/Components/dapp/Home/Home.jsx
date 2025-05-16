import React, { useState, useEffect } from 'react';
import './Home.css';
// Componente de Tarjeta Animada
const AnimatedCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`animated-card ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

// Componente de Contador Animado
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span className="counter">{count}+</span>;
};

const Home = ({ connectWallet, setCurrentPage }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Datos del equipo mejorados
  const teamMembers = [
    {
      name: "Cristhoper Socalay",
      role: "Blockchain Architect",
      photo: "https://media.licdn.com/dms/image/v2/D4E03AQHXfAeH7GpF_A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1665289684593?e=1752710400&v=beta&t=W4-2lT35pNSkhWRQIb-Dfgvfylm7Q_3W9grgmoqnlcs",
      bio: "Experto en Solidity y arquitecturas DeFi con 5 años de experiencia en proyectos blockchain escalables.",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      skills: ["Solidity", "Rust", "Layer 2", "ZK Proofs"]
    },
    {
      name: "Jonas Zubieta",
      role: "Lead UX/UI Designer",
      photo: "https://media.licdn.com/dms/image/v2/D4E03AQEXz-ZJ-ARMPA/profile-displayphoto-shrink_400_400/B4EZYeXOn6HkAg-/0/1744266128463?e=1752710400&v=beta&t=E3-oUFSuXjOFDD3umWeQpmMXzX6eW8QN-0GeIVZlvDA",
      bio: "Especialista en diseño de interfaces financieras y experiencia de usuario para aplicaciones Web3.",
      social: {
        linkedin: "#",
        dribbble: "#",
        behance: "#"
      },
      skills: ["Figma", "UX Research", "Prototyping", "Motion Design"]
    },
  ];

  // Características mejoradas con animación
  const features = [
    {
      title: "Balance en Tiempo Real",
      description: "Monitoreo instantáneo de fondos con actualizaciones en tiempo real directamente desde la blockchain",
      icon: '📈',
      animation: "fadeIn"
    },
    {
      title: "Transacciones Instantáneas",
      description: "Confirmación en segundos con nuestra tecnología Layer 2 patentada y bajas comisiones",
      icon: '⚡',
      animation: "slideUp"
    },
    {
      title: "Seguridad Institucional",
      description: "Protección multi-firma, verificación en cadena y almacenamiento en frío opcional",
      icon: '🔒',
      animation: "zoomIn"
    },
    {
      title: "Gestión Inteligente",
      description: "Organiza contactos, transacciones frecuentes y crea flujos de pagos automatizados",
      icon: '💼',
      animation: "fadeIn"
    },
    {
      title: "Staking Integrado",
      description: "Genera rendimientos directamente desde tu wallet sin intermediarios",
      icon: '💰',
      animation: "slideUp"
    },
    {
      title: "NFT Compatible",
      description: "Visualiza y gestiona tu colección de NFTs junto con tus activos digitales",
      icon: '🖼️',
      animation: "zoomIn"
    }
  ];

  // Wallets soportadas
  const supportedWallets = [
    { name: "MetaMask", icon: "🦊", link: "#" },
    { name: "WalletConnect", icon: "🔷", link: "#" },
    { name: "Coinbase", icon: "🟠", link: "#" },
    { name: "Trust Wallet", icon: "🔶", link: "#" },
    { name: "Ledger", icon: "🔐", link: "#" },
    { name: "Trezor", icon: "💳", link: "#" }
  ];

  // Estadísticas
  const stats = [
    { value: <Counter target={125} />, label: "Países soportados" },
    { value: <Counter target={24} />, label: "Blockchains integradas" },
    { value: <Counter target={500000} />, label: "Usuarios activos" },
    { value: <Counter target={150} />, label: "Tokens disponibles" }
  ];

  // Testimonios
  const testimonials = [
    {
      quote: "Paga'pe ha revolucionado cómo manejo mis finanzas internacionales. Las transacciones son instantáneas y las comisiones mínimas.",
      author: "Angel Castilla",
      role: "Analista en Sistema",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjURtR6EQIi4l-jf4gI8-YzaGu873MojCoKdjczaxS9-9V02V7f3=s48-p"
    },
    {
      quote: "Como freelancer que trabaja con clientes en todo el mundo, Paga'pe me ha ahorrado horas de gestión y cientos en comisiones bancarias.",
      author: "Alexa Rejas",
      role: "Analista en Sistema",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUob6IRYy8NNdmEm3yzfm16fyWN5QreGWcTOLv15E5vRyVuA9E=s48-p"
    },
    {
      quote: "La seguridad y facilidad de uso de Paga'pe no tienen comparación. Mi empresa ha migrado todas nuestras operaciones internacionales a esta plataforma.",
      author: "Danna Lopez",
      role: "Analista en Sitemas",
      avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWg-FmsRJa-wx3kz7G6nkQi_V1_8imXvR9UmGb7PdQq8VwTMC_4=s48-p"
    }
  ];

  // Rotación automática de características
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="home-page">
      {/* Hero Section Mejorada */}
      <section className="hero-section">
        <div className="hero-bg-particles" id="particles-js"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <AnimatedCard delay={200}>
                <h1>
                  <span className="highlight">Paga'pe</span>
                  <span className="sub-headline">El Futuro de las Finanzas Globales</span>
                </h1>
              </AnimatedCard>

              <AnimatedCard delay={400}>
                <p className="subtitle">
                  La plataforma Web3 más avanzada para pagos transfronterizos, diseñada para la economía digital del mañana
                </p>
              </AnimatedCard>

              <AnimatedCard delay={600}>
                <div className="hero-buttons">
                  <button className="connect-button glow-on-hover" onClick={connectWallet}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                      alt="MetaMask"
                      className="wallet-logo"
                    />
                    Conectar Wallet
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => setCurrentPage('dashboard')}
                  >
                    <span className="button-icon">▶️</span>
                    Demo Interactiva
                  </button>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={800}>
                <div className="security-badges">
                  <div className="audit-badge">
                    <span>🔐 Auditoría Certificada por Quantstamp</span>
                  </div>
                  <div className="audit-badge">
                    <span>🛡️ Protección de Seguro de hasta $1M</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="hero-image">
              <AnimatedCard delay={1000}>
                <div className="phone-mockup floating">
                  <div className="screen">
                    <div className="app-interface">
                      <div className="network-indicator">
                        <span className="dot"></span>
                        <span className="network-name">Paga'pe Network</span>
                        <span className="network-status">• Conectado</span>
                      </div>
                      <div className="balance-display">
                        <span className="currency">$</span>
                        <span className="amount">1,245.50</span>
                        <span className="currency">USD</span>
                      </div>
                      <div className="action-buttons">
                        <button className="send-btn">Enviar</button>
                        <button className="receive-btn">Recibir</button>
                        <button className="swap-btn">Swap</button>
                      </div>
                      <div className="recent-transactions">
                        <div className="transaction">
                          <div className="tx-icon received">📥</div>
                          <div className="tx-details">
                            <span className="tx-title">Depósito inicial</span>
                            <span className="tx-date">Hace 2 horas</span>
                          </div>
                          <div className="tx-amount positive">+ $1,200.00</div>
                        </div>
                        <div className="transaction">
                          <div className="tx-icon sent">📤</div>
                          <div className="tx-details">
                            <span className="tx-title">Envío a Juan Pérez</span>
                            <span className="tx-date">Hace 4 horas</span>
                          </div>
                          <div className="tx-amount negative">- $50.00</div>
                        </div>
                        <div className="transaction">
                          <div className="tx-icon swap">🔄</div>
                          <div className="tx-details">
                            <span className="tx-title">ETH → USDC</span>
                            <span className="tx-date">Ayer</span>
                          </div>
                          <div className="tx-amount neutral">0.25 ETH</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <div className="partners-logos">
            <img src="data:image/png;base64,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" alt="Binance" />
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAAM1BMVEUAUv////9Aff/f6f8gaP/v9P8QXf+fvv9gkv+/1P8wc/+AqP9QiP+Qs/9vnv+vyf/P3/+xY2WpAAAEsklEQVR4nO2d23qjMAyEE3OGAHn/p93QtE1zZEaSbdhP//06s0KWLVtWDwfHcRzHcRzHcRzHce4oy3BqvziFUOZWs0YdpnEujg8UXTOFOre2l5Rt8yT3Tvo89bk13hPGj4J/hTenrVg8jBWi+JvmlFvvxY2HM6H42955Jydn5BtdyCe5Eym+mrvNIrlXSM4kux51khe6xL49yXz5kZRTUusZN9L5yGAleSGNsUszM18pEoS/1sab/zLE1mwQNJ6JG0ZqY9f4oYiouoT2chKqaI4dT/OFSLGvt5+Cf4kyHSNrjqI6uuYIqsv4ms39OuocvGGaiiXSfKwsE/ZIa8ozhquM6bbuM2crzW06zcfjaKM5SeC4YRNCEk3CHyoLt07o0Fc6veYytebjcVKLTuwcC2oHSe4cC0oHEUeOojh3Z/FX0qUEDf+DVTOdfr9vHdqGPla9/JdVhmZ/rRte+GPZ0tsAzVzkDF2Nbz9riV0V3IaS3xgE6neGzz/UUrLlCQFj6Hk1TpVMJBKbmvBo7GyL2ZZLvRo39IzaBTe2MIDghiYc8AQHflmsRrfRFbWZhF1EtiyCo7N5HaxaMhXReEfnoqhqSdQDp6Eg0QA3NJJ0EbOHaBEAPyI/FbGBG4lmNPLxBoG8Q3xMAe2g+PgBeYc4c8bcmo0f0MoidI4FyEFYm0AriyKXq5EvyRoFcWmFoTGrsPsPJEfSJc2IqTmnroERVYY+HCbgJ7jzaiRKK2/RaiCAcJtqwAyqjHkBmDbcxwRuk9VnssDX5AwDrFjqmwbAPypqwPWpzY33EsAyVIBaH27WiwYmDvM5gUXc4KYScGpmIe/XhzO48qvDKszqAthgYyW6F07ronNLfAbYzeSW+My6aPV6aI+LTsV/KtpgFbcGCHlbeZFwA1hctvfoBth7WFTurC/jjGkA0foLbOR7UqZZHy7N1pTKQ3eZBMzGRngJkI5T4wGZsjoLAOIqd66+kSMEbuJs5LCG+5oJjsWQE0jSLvbHgwl+ATnqVU1FxNDs/RYypqpAKsahOnR9oSiQinJ9gV0UiQMIdlFEf0noFU4hnYvQlRx/ZYtdfgq3TbEuP5GdgWxg+JpZcIgFvtKKd6Ev2SeA5uDL+NHSCVGaARbuRCtSEa0CcJFUnHIg2RxHtmFXohReCTNnvMQNfiiLv8GUbteJqk3sVTLzPFdclcEU464bu2bKNuV5EVUguyK7Hqj6ccXDEbLuuXkb/UjJqgSUM/WF86seL/VEF32rXugIyuuLebodwdV9S5Z7X8fQaCZi9ePPFl1XFNJ/rXwKhZSSmKPM87G6IGP0r7eAG2drDE6R9/jgLLmD2LxY3eUjyl0+V43U1OM1Zg+D9/kEGytnNcDkfe0ve2wrkCiEGKwq9+yxVcY+m5Lss/3LPhvt7LOl0T6bRx0ibVS72GU6e2yIZu/YKVrPHYxdBH6eq8XO2FXKfrKTjewxbaFcKTh7eiRDH1mt7EytbzWyM3brlcrOKPlLNtdMYqEaNvCeIHzuS/6gOLOR/xBG6BiqajbWEL5caU5TNFtrBP/N0nK/e5JenJtpMw3g31L3IVz/uEEb+u3VWTuO4ziO4ziO4zhOZv4B2CM5+pniOqsAAAAASUVORK5CYII=" alt="Coinbase" />
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEVHcExhAP9hAP9hAP9hAP9hAP9hAP9hAP9hAP9YAP9PAP+Ycv/Wyf/+/f9vKf+piv/u6P+6ov/mQhDuAAAACXRSTlMABHG/7v+F1tXZaQ2CAAAAuUlEQVR4AXSQhRHAIAwAg0Mgbdh/2R6W+p9UPg4dpY11gjVageDdC79ccB/E4aL7JDxrPisr94sC7R4kedNg7gpzRjcxYO9ZhahsM9nCze1EzER1WriohEQVcSdCkVKxIjE6h/yULZ4yf8rUOpUmU3JPicRb68m5thJP2Qo2SW0o9y1TkTUvkvJYIokSmdplZH2RdtqN1+EEC8bJpnJyOby+nM/d0XAMX2TjSybQxEdq8mMnlKjxZgcA1OESMlvzxREAAAAASUVORK5CYII=" alt="Polygon" />
            <img src="data:image/png;base64,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" alt="Chainlink" />
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAaVBMVEXoQUL////oPj/nOTrnMTLpVFXnMzTrSUrnOzz//PznLC30mprvZWb+8/PnNTb96en4wcL0oaHxhITsZ2j2ra382tvnJCX60NHrTU7yjIzrW1z97u74y8vwkJHzpqbue3z74eH1tbbscHCXX8UWAAACUklEQVRIiZ1X2baCMAxMW+gmIigKbtfl/z/ylrKlNKiHeZN2mrRJJhEYhV1R7g+pUulhXxY7cgvEn+qztjLXHBy4zqXV5/oHYgVWeM4ELixUX4hVImesniuT6gPxqBKK1SFRxyXi5kRaG62eNiTRZB/M9UYzExO3SnzjAQi1nRO3oL/zwG3ahkSjCJ4gfNDKBMSM2JPcS+LWIsPEDbVj777nxHmbiXg8EddJ2ttoIkCn40hUxLL8a1cKG69wNRArwlHeX/5CnOmzz60bKvC26LOQMAmJ8cRKxks6GwL9IN5bVp4IhDd2TOjrwj2A1YQzbSjG1CdM2toRz9TCdSI+qYPPjkjdoUT1c6WeRzDYxd85RzxWk4++gyJ+0yEUHQ5U2cgCyshVfsG8G+UpiBIe0YE20JaGlBP9gGy+IB6Y96L1hGfQRAZRKJjxdcXzyK2IBjmWMnZviVy93l8FiWuDeF2s2kvHlTezmbywQW/I59/8cZvZ4/A0iL3f7aWAvYNruscJw2GDvpS2hyZ/yOsBLhxBAuh3FIpOKNhMuFwCBClncRM1XqnsLfjZw6UcdiG/Y4PeBPIBC5dLclxWEoeiKyfsAxIuERSyDELhxUZgHybh8oU8SUeOeV3ggvxjh8Gkl45JrORz9qIuFjfEM0P6dGKF5FGmPRoxFIVs0hHjUNHLIxJkPgDiT+hjL8hkC/iEoQXQTWcZU9Oh29wiUJsjG+uio6ix0q2cRtjK6eGBwnx4WD2urB+Q1o9kbPUQyNaPnWz1oOup60brFiuHeY8f/j78A4VcGcQDx3rVAAAAAElFTkSuQmCC" alt="Avalanche" />
          </div>
        </div>
      </section>

      {/* Features Section Mejorada */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Potencia tus <span className="highlight">Finanzas Digitales</span></h2>
            <p>Una suite completa de herramientas financieras descentralizadas en una sola plataforma</p>
          </div>

          <div className="features-tabs">
            <div className="features-nav">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-tab ${index === activeFeature ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <span className="tab-icon">{feature.icon}</span>
                  {feature.title}
                </button>
              ))}
            </div>
            <div className="features-content">
              <AnimatedCard key={activeFeature}>
                <div className={`feature-detail ${features[activeFeature].animation}`}>
                  <h3>{features[activeFeature].title}</h3>
                  <p>{features[activeFeature].description}</p>
                  <div className="feature-actions">
                    <button className="learn-more-btn">Más información</button>
                    <button className="demo-btn" onClick={() => setCurrentPage('dashboard')}>
                      <span className="button-icon">▶️</span>
                      Ver demo
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} delay={index * 200}>
                <div className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Network Visualization */}
      <section className="network-section">
        <div className="container">
          <div className="section-header">
            <h2>Tecnología <span className="highlight">Multicadena</span></h2>
            <p>Conectando las blockchains más importantes en una sola interfaz</p>
          </div>
          <div className="network-visualization">
            <div className="network-node main-node">
              <div className="node-icon">
                <img src="/img/Pagape.png" alt="Paga'pe Logo" className="network-logo" />
              </div>
              <div className="node-label">Paga'pe</div>
            </div>
            <div className="network-connections">
              <div className="connection-line eth">
                <div className="connection-dots"></div>
                <div className="chain-logo">⟠</div>
              </div>
              <div className="connection-line bsc">
                <div className="connection-dots"></div>
                <div className="chain-logo">⎈</div>
              </div>
              <div className="connection-line polygon">
                <div className="connection-dots"></div>
                <div className="chain-logo">⬡</div>
              </div>
              <div className="connection-line solana">
                <div className="connection-dots"></div>
                <div className="chain-logo">◎</div>
              </div>
            </div>
            <div className="network-nodes">
              <div className="network-node eth">
                <div className="node-icon">⟠</div>
                <div className="node-label">Ethereum</div>
              </div>
              <div className="network-node bsc">
                <div className="node-icon">⎈</div>
                <div className="node-label">BNB Chain</div>
              </div>
              <div className="network-node polygon">
                <div className="node-icon">⬡</div>
                <div className="node-label">Polygon</div>
              </div>
              <div className="network-node solana">
                <div className="node-icon">◎</div>
                <div className="node-label">Solana</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Mejorada */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Nuestro <span className="highlight">Equipo</span></h2>
            <p>Los expertos en blockchain y finanzas detrás de Paga'pe</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <AnimatedCard key={index} delay={index * 200}>
                <div className="team-card">
                  <div className="team-photo-container">
                    <div
                      className="team-photo"
                      style={{ backgroundImage: `url(${member.photo})` }}
                    />
                    <div className="team-social-hover">
                      {Object.entries(member.social).map(([platform, url]) => (
                        <a key={platform} href={url} className={`social-${platform}`}>
                          {platform === 'github' && '🐙'}
                          {platform === 'linkedin' && '🔗'}
                          {platform === 'twitter' && '🐦'}
                          {platform === 'dribbble' && '🏀'}
                          {platform === 'behance' && '🅱️'}
                        </a>
                      ))}
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="bio">{member.bio}</p>
                  <div className="skills-container">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Lo que dicen <span className="highlight">nuestros usuarios</span></h2>
            <p>Testimonios de la comunidad Paga'pe</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} delay={index * 200}>
                <div className="testimonial-card">
                  <div className="testimonial-quote">"{testimonial.quote}"</div>
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.author} className="author-avatar" />
                    <div className="author-info">
                      <div className="author-name">{testimonial.author}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Mejorada */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Únete a la <span className="highlight">Revolución Financiera</span></h2>
            <p>Comienza hoy mismo a disfrutar de pagos globales instantáneos y sin fronteras</p>

            <div className="cta-buttons">
              <button className="connect-button large glow-on-hover" onClick={connectWallet}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  className="wallet-logo"
                />
                Conectar Wallet
              </button>
              <button className="secondary-button large">
                <span className="button-icon">📱</span>
                Descargar App
              </button>
            </div>

            <div className="supported-wallets">
              <span>Wallets soportadas:</span>
              <div className="wallets-container">
                {supportedWallets.map((wallet, index) => (
                  <a key={index} href={wallet.link} className="wallet-icon">
                    {wallet.icon} {wallet.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
