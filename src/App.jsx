import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from './config';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState({ groom: false, bride: false });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // D-Day 카운터
  useEffect(() => {
    const targetDate = new Date(`${config.wedding.date}T${config.wedding.time}:00`).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // 계좌번호 복사 함수
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  // 갤러리 이미지 배열
  const galleryImages = config.gallery.filter(Boolean);

  // 갤러리 스와이프 핸들러
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setIsDragging(false);
      } else if (diffX < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setIsDragging(false);
      } else if (diffX < 0 && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ICS 파일 다운로드 함수
  const downloadICS = () => {
    const dateFormatted = config.wedding.date.replace(/-/g, '');
    const timeFormatted = config.wedding.time.replace(':', '') + '00';
    
    const event = {
      title: `${config.groom.name} & ${config.bride.name} 결혼식`,
      description: `${config.venue.name}에서 열리는 결혼식에 초대합니다.`,
      location: `${config.venue.name} (${config.venue.address})`,
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//KR
BEGIN:VEVENT
UID:wedding-${config.wedding.date}@invitation
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${dateFormatted}T${timeFormatted}
DTEND:${dateFormatted}T${String(parseInt(config.wedding.time.split(':')[0]) + 2).padStart(2, '0')}0000
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wedding-invitation.ics';
    link.click();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3, #e0e7ff)' 
    }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom right, rgba(251, 113, 133, 0.2), rgba(244, 114, 182, 0.2), rgba(196, 181, 253, 0.2))'
        }}></div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 50%)'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ 
              fontSize: '0.75rem', 
              letterSpacing: '0.3em', 
              color: 'rgba(251, 113, 133, 0.8)', 
              marginBottom: '2rem',
              fontWeight: 300
            }}>WEDDING INVITATION</div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em'
            }}>{config.groom.name}</h1>
            <div style={{ fontSize: '1.875rem', marginBottom: '0.75rem' }}>
              <span style={{ color: '#fda4af' }}>♥</span>
            </div>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 300, 
              color: '#1f2937', 
              marginBottom: '3rem',
              letterSpacing: '-0.025em'
            }}>{config.bride.name}</h1>
            <div style={{ 
              fontSize: '1rem', 
              color: '#4b5563', 
              marginBottom: '0.25rem',
              fontWeight: 300,
              letterSpacing: '0.025em'
            }}>
              {config.wedding.dateText}
            </div>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              fontWeight: 300
            }}>{config.wedding.timeText}</div>
          </motion.div>
        </div>

        <motion.div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* 인사말 Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>{config.greeting.title}</h2>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              color: '#4b5563',
              lineHeight: 1.625,
              fontSize: '0.9375rem',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 300 }}>
                {config.greeting.message.map((line, i) => (
                  <span key={i}>{line}{i < config.greeting.message.length - 1 && <br />}</span>
                ))}
              </p>
              <p style={{ fontWeight: 300, paddingTop: '0.5rem' }}>
                {config.greeting.subMessage.map((line, i) => (
                  <span key={i}>{line}{i < config.greeting.subMessage.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
            <div style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(229, 231, 235, 0.6)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}>
              <p style={{ fontWeight: 300 }}>{config.groom.fatherName} · {config.groom.motherName}의 {config.groom.relation} {config.groom.name}</p>
              <p style={{ fontWeight: 300 }}>{config.bride.fatherName} · {config.bride.motherName}의 {config.bride.relation} {config.bride.name}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* D-Day 카운터 Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2.5rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>D-Day</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.625rem'
            }}>
              {[
                { label: '일', value: timeLeft.days },
                { label: '시', value: timeLeft.hours },
                { label: '분', value: timeLeft.minutes },
                { label: '초', value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.6)'
                  }}>
                    <div style={{
                      fontSize: '1.875rem',
                      fontWeight: 300,
                      color: '#374151',
                      marginBottom: '0.125rem',
                      letterSpacing: '-0.025em'
                    }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontWeight: 300
                    }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 픽셀아트 Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>우리의 이야기</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <img 
                src={config.pixelArt}
                alt="픽셀아트" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = e.target.nextElementSibling;
                  if (errorDiv) {
                    errorDiv.style.display = 'block';
                  }
                }}
              />
              <div style={{
                display: 'none',
                textAlign: 'center',
                color: '#6b7280',
                padding: '2rem 0',
                fontSize: '0.875rem',
                fontWeight: 300,
                width: '100%'
              }}>
                <p>픽셀아트 이미지를 준비해주세요</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>/public/pixel-art.gif 파일을 추가하세요</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 갤러리 Section */}
      <section className="py-16">
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#374151',
            letterSpacing: '0.025em'
          }}>갤러리</h2>
          <div style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.75rem'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                style={{
                  display: 'flex',
                  transition: 'transform 300ms ease-out',
                  transform: `translateX(-${currentImageIndex * 100}%)`
                }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} style={{ minWidth: '100%', flexShrink: 0 }}>
                    <img 
                      src={image}
                      alt={`갤러리 ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const errorDiv = e.target.nextElementSibling;
                        if (errorDiv) {
                          errorDiv.style.display = 'flex';
                        }
                      }}
                    />
                    <div style={{
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      aspectRatio: '16/9',
                      background: 'linear-gradient(to bottom right, #ffe4e6, #fce7f3)',
                      borderRadius: '0.75rem'
                    }}>
                      <div style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
                        <svg style={{ width: '4rem', height: '4rem', margin: '0 auto 0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p style={{ fontSize: '0.875rem', fontWeight: 300 }}>사진 {index + 1}</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#9ca3af' }}>/public/gallery-{index + 1}.jpg 파일을 추가하세요</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {galleryImages.length > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        width: index === currentImageIndex ? '1.5rem' : '0.5rem',
                        height: '0.5rem',
                        borderRadius: '9999px',
                        border: 'none',
                        backgroundColor: index === currentImageIndex ? '#fb7185' : '#d1d5db',
                        cursor: 'pointer',
                        transition: 'all 300ms'
                      }}
                      aria-label={`이미지 ${index + 1}로 이동`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 오시는 길 Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>오시는 길</h2>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#4b5563' }}>
              <p style={{ fontSize: '1rem', fontWeight: 300, marginBottom: '0.5rem' }}>{config.venue.name}</p>
              {config.venue.hall && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '0.5rem' }}>{config.venue.hall}</p>
              )}
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 300, marginBottom: '1rem' }}>{config.wedding.dateText} {config.wedding.timeText}</p>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300 }}>
                <p style={{ marginBottom: '0.75rem', fontWeight: 400 }}>주소</p>
                <p style={{ lineHeight: 1.625 }}>
                  {config.venue.address}<br />
                  {config.venue.addressDetail && (
                    <span style={{ color: '#6b7280' }}>{config.venue.addressDetail}</span>
                  )}
                </p>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#4b5563', fontWeight: 300, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 400 }}>교통편</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
                {config.transportation.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              {config.busInfo && (
                <p style={{ textAlign: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(229, 231, 235, 0.6)' }}>{config.busInfo}</p>
              )}
            </div>
            {/* 지도 버튼들 */}
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a
                href={config.maps.naver}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(3, 199, 90, 0.15)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  color: '#03C75A',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px 0 rgba(3, 199, 90, 0.15)',
                  transition: 'all 300ms',
                  cursor: 'pointer',
                  border: '1px solid rgba(3, 199, 90, 0.3)'
                }}
              >
                <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5v-9l7 4.5-7 4.5z"/>
                </svg>
                네이버 지도
              </a>
              <a
                href={config.maps.kakao}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(254, 229, 0, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  color: '#3C1E1E',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px 0 rgba(254, 229, 0, 0.2)',
                  transition: 'all 300ms',
                  cursor: 'pointer',
                  border: '1px solid rgba(254, 229, 0, 0.5)'
                }}
              >
                <svg style={{ width: '1.125rem', height: '1.125rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.3 4.6 6.7l-.96 3.6c-.1.35.3.64.6.44l4.2-2.8c.52.05 1.04.06 1.56.06 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                카카오맵
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 계좌번호 Section */}
      <section className="py-16">
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#374151',
            letterSpacing: '0.025em'
          }}>마음 전하실 곳</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 신랑측 계좌 */}
            <motion.div
              style={{
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                marginBottom: '1.25rem',
                color: '#374151',
                textAlign: 'center',
                letterSpacing: '0.025em'
              }}>신랑측</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.bank}</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.accountNumber}</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.groom.holder}</span></p>
              </div>
              <button
                onClick={() => copyToClipboard(`${config.accounts.groom.bank} ${config.accounts.groom.accountNumber} ${config.accounts.groom.holder}`, 'groom')}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                  transition: 'all 300ms'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                {copied.groom ? '✓ 복사되었습니다!' : '계좌번호 복사'}
              </button>
            </motion.div>

            {/* 신부측 계좌 */}
            <motion.div
              style={{
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                marginBottom: '1.25rem',
                color: '#374151',
                textAlign: 'center',
                letterSpacing: '0.025em'
              }}>신부측</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 300 }}>은행명 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.bank}</span></p>
                <p style={{ fontWeight: 300 }}>계좌번호 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.accountNumber}</span></p>
                <p style={{ fontWeight: 300 }}>예금주 <span style={{ marginLeft: '0.5rem' }}>{config.accounts.bride.holder}</span></p>
              </div>
              <button
                onClick={() => copyToClipboard(`${config.accounts.bride.bank} ${config.accounts.bride.accountNumber} ${config.accounts.bride.holder}`, 'bride')}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '0.75rem',
                  padding: '0.625rem',
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                  transition: 'all 300ms'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                {copied.bride ? '✓ 복사되었습니다!' : '계좌번호 복사'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 캘린더 추가 Section */}
      <section className="py-16">
        <div className="container">
          <motion.div
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.06)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '1.5rem',
              color: '#374151',
              letterSpacing: '0.025em'
            }}>캘린더에 추가</h2>
            <p style={{
              color: '#4b5563',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 300
            }}>
              결혼식 일정을 캘린더에 추가하시겠어요?
            </p>
            <button
              onClick={downloadICS}
              style={{
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '0.75rem',
                padding: '0.75rem 2rem',
                color: '#4b5563',
                fontSize: '0.875rem',
                fontWeight: 300,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
                transition: 'all 300ms'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              캘린더에 추가하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6b7280' }}>
        <div className="container">
          <p style={{ marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 300 }}>{config.groom.name} ♥ {config.bride.name}</p>
          <p style={{ fontSize: '0.75rem', fontWeight: 300 }}>{config.wedding.dateText}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
