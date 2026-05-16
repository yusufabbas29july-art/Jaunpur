/**
 * ==============================================================================
 * JAUNPUR HISTORICAL ARCHIVE - ENTERPRISE JAVASCRIPT ENGINE
 * ==============================================================================
 * Author: Mohammed Yusuf Abbas
 * Version: 8.0.0 (Ultimate Academic Build - Locked Down & Bug Free)
 * Description: Advanced interactive features, state management, and accessibility.
 * ==============================================================================
 */

"use strict";

document.addEventListener('DOMContentLoaded', () => {

    const DOM = {
        html: document.documentElement,
        body: document.body,
        header: document.querySelector('.app-header'),
        progressBar: document.getElementById('scroll-progress'),
        themeToggleBtn: document.getElementById('theme-toggle'),
        printBtn: document.getElementById('print-btn'),
        sunIcon: document.querySelector('.sun-icon'),
        moonIcon: document.querySelector('.moon-icon'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        sidebar: document.getElementById('sidebar-nav'),
        tocContainer: document.getElementById('toc-container')?.querySelector('.toc-list') || document.querySelector('.toc-list'),
        mainContent: document.getElementById('main-content'),
        sections: document.querySelectorAll('.paper-section'),
        heroBg: document.querySelector('.paper-header-bg'),
        readingTimeEl: document.querySelector('#reading-time span'),
        revealElements: document.querySelectorAll('.reveal-on-scroll'),
        backToTopBtn: document.querySelector('.back-to-top-btn') || createBackToTopBtn()
    };

    let isScrolling = false;

    const Utils = {
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        debounce: (func, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }
    };

    function createBackToTopBtn() {
        let btn = document.querySelector('.back-to-top-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'back-to-top-btn';
            btn.setAttribute('aria-label', 'Scroll back to top');
            btn.title = "Back to Top";
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
            `;
            document.body.appendChild(btn);
        }
        return btn;
    }

    // ==========================================================================
    // 1. TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    const ToastSystem = (() => {
        let container = document.getElementById('toast-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                z-index: 100000; display: flex; flex-direction: column; gap: 10px; pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const show = (message, icon = "✨") => {
            const toast = document.createElement('div');
            toast.style.cssText = `
                background: var(--bg-surface, #ffffff); color: var(--text-primary, #1e293b); 
                padding: 14px 28px; border-radius: 50px; font-family: var(--font-ui, sans-serif); 
                font-size: 0.95rem; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
                opacity: 0; transform: translateY(20px) scale(0.9); 
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.26, 1.55);
                display: flex; align-items: center; gap: 12px; 
                border: 2px solid var(--brand-primary, #9f1239);
            `;
            
            toast.innerHTML = `<span style="font-size: 1.3rem;">${icon}</span> <span>${message}</span>`;
            container.appendChild(toast);
            
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0) scale(1)';
            });
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px) scale(0.9)';
                setTimeout(() => toast.remove(), 400);
            }, 3500);
        };

        return { show };
    })();

    // ==========================================================================
    // 2. SECURITY SCRIPT (PROTECT RESEARCH)
    // ==========================================================================
    const SecuritySystem = (() => {
        const init = () => {
            document.addEventListener('contextmenu', event => {
                event.preventDefault();
                ToastSystem.show("Right-click is disabled to protect this research. 💖", "🔒");
            });

            // Added preventDefault() to physically block the copy action
            document.addEventListener('copy', event => {
                event.preventDefault();
                ToastSystem.show("Please ensure you properly cite the author when using this material! 📚", "✍️");
            });
        };
        return { init };
    })();

    // ==========================================================================
    // 3. PRINT SYSTEM
    // ==========================================================================
    const PrintSystem = (() => {
        const init = () => {
            if (!DOM.printBtn) return;

            DOM.printBtn.addEventListener('click', () => {
                ToastSystem.show("Preparing document for high-quality printing... 🖨️", "✨");
                setTimeout(() => {
                    window.print();
                }, 800);
            });
        };
        return { init };
    })();

    // ==========================================================================
    // 4. THEME MANAGER
    // ==========================================================================
    const ThemeManager = (() => {
        const init = () => {
            if (!DOM.themeToggleBtn) return;

            const savedTheme = localStorage.getItem('jaunpur-archive-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                setTheme('dark');
            } else {
                setTheme('light');
            }

            DOM.themeToggleBtn.addEventListener('click', () => {
                const currentTheme = DOM.html.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                
                const msg = newTheme === 'dark' ? "Dark mode activated. Focus enhanced. 🦉" : "Light mode activated. 🌻";
                ToastSystem.show(msg, newTheme === 'dark' ? "🌙" : "☀️");
            });
        };

        const setTheme = (theme) => {
            DOM.html.setAttribute('data-theme', theme);
            localStorage.setItem('jaunpur-archive-theme', theme);
            
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#f8fafc');
            }

            if (theme === 'dark') {
                if (DOM.sunIcon) DOM.sunIcon.classList.add('hidden');
                if (DOM.moonIcon) DOM.moonIcon.classList.remove('hidden');
            } else {
                if (DOM.sunIcon) DOM.sunIcon.classList.remove('hidden');
                if (DOM.moonIcon) DOM.moonIcon.classList.add('hidden');
            }
        };

        return { init };
    })();

    // ==========================================================================
    // 5. CONTENT ANALYZERS
    // ==========================================================================
    const ContentAnalyzers = (() => {
        const calculateReadingTime = () => {
            if (!DOM.mainContent || !DOM.readingTimeEl) return;
            const textContent = DOM.mainContent.innerText || DOM.mainContent.textContent;
            const wordCount = textContent.trim().split(/\s+/).length;
            const readTimeMinutes = Math.ceil(wordCount / 230);
            DOM.readingTimeEl.textContent = `${readTimeMinutes} Min Read`;
        };

        const generateTOC = () => {
            if (!DOM.tocContainer || DOM.sections.length === 0) return;
            if (DOM.tocContainer.children.length > 0) return; 

            const fragment = document.createDocumentFragment();

            DOM.sections.forEach((section, index) => {
                const heading = section.querySelector('h2');
                if (heading) {
                    if (!section.id) section.id = `archive-section-${index}`;
                    
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `#${section.id}`;
                    
                    let titleText = heading.innerText.replace(/\[.*?\]/g, '').trim();
                    if(titleText.includes(':') && titleText.length > 40) {
                        titleText = titleText.split(':')[0]; 
                    }
                    
                    a.textContent = titleText;
                    a.className = 'toc-link';
                    a.setAttribute('data-target', section.id);
                    
                    li.appendChild(a);
                    fragment.appendChild(li);
                }
            });
            DOM.tocContainer.appendChild(fragment);
        };

        const init = () => {
            calculateReadingTime();
            generateTOC();
        };

        return { init };
    })();

    // ==========================================================================
    // 6. SCROLL ENGINE
    // ==========================================================================
    const ScrollEngine = (() => {
        let hasTriggeredConfetti = false;

        const init = () => {
            setupSmoothScroll();
            
            window.addEventListener('scroll', Utils.throttle(() => {
                if (!isScrolling) {
                    window.requestAnimationFrame(() => {
                        handleScrollMetrics();
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            }, 10), { passive: true });
        };

        const handleScrollMetrics = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            if (DOM.progressBar && docHeight > 0) {
                const scrollPercent = (scrollTop / docHeight) * 100;
                DOM.progressBar.style.width = `${scrollPercent}%`;

                if (scrollPercent >= 98 && !hasTriggeredConfetti) {
                    hasTriggeredConfetti = true;
                    ConfettiSystem.fire();
                    ToastSystem.show("You've reached the end of the paper! Masterful reading! 🎉", "🎓");
                }
            }

            if (DOM.heroBg && scrollTop <= window.innerHeight) {
                DOM.heroBg.style.transform = `translate3d(0, ${scrollTop * 0.35}px, 0)`;
            }

            if (DOM.backToTopBtn) {
                if (scrollTop > 800) {
                    DOM.backToTopBtn.classList.add('is-visible');
                } else {
                    DOM.backToTopBtn.classList.remove('is-visible');
                }
            }
        };

        const setupSmoothScroll = () => {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        
                        if (DOM.sidebar && DOM.sidebar.classList.contains('mobile-open')) {
                            MobileMenu.toggle();
                        }

                        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });
            });
        };

        return { init };
    })();

    // ==========================================================================
    // 7. SCROLL SPY (ROCK-SOLID: NO JUMPING, JUST HIGHLIGHTS)
    // ==========================================================================
    const ScrollSpy = (() => {
        const init = () => {
            if (!DOM.tocContainer || !DOM.sections.length) return;

            const tocLinks = DOM.tocContainer.querySelectorAll('a');
            if (!tocLinks.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '-15% 0px -85% 0px', 
                threshold: 0
            };

            const scrollSpyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        
                        tocLinks.forEach(link => {
                            link.classList.remove('active');
                            const hrefId = link.getAttribute('href').substring(1);
                            if (hrefId === activeId || link.getAttribute('data-target') === activeId) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, observerOptions);

            DOM.sections.forEach(section => scrollSpyObserver.observe(section));
        };

        return { init };
    })();

    // ==========================================================================
    // 8. MOBILE MENU MANAGER
    // ==========================================================================
    const MobileMenu = (() => {
        let isOpen = false;

        const toggle = () => {
            if (!DOM.sidebar || !DOM.mobileMenuBtn) return;
            isOpen = !isOpen;
            
            if (isOpen) {
                DOM.sidebar.classList.add('mobile-open');
                DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
                DOM.body.style.overflow = 'hidden'; 
            } else {
                DOM.sidebar.classList.remove('mobile-open');
                DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
                DOM.body.style.overflow = ''; 
            }
        };

        const init = () => {
            if (!DOM.mobileMenuBtn) return;

            DOM.mobileMenuBtn.addEventListener('click', toggle);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isOpen) toggle();
            });

            document.addEventListener('click', (e) => {
                if (isOpen && !DOM.sidebar.contains(e.target) && !DOM.mobileMenuBtn.contains(e.target)) {
                    toggle();
                }
            });

            window.addEventListener('resize', Utils.debounce(() => {
                if (window.innerWidth > 1024 && isOpen) {
                    toggle();
                }
            }, 200));
        };

        return { init, toggle };
    })();

    // ==========================================================================
    // 9. ANIMATIONS
    // ==========================================================================
    const Animations = (() => {
        const init = () => {
            if (!DOM.revealElements.length) return;

            const revealOptions = {
                threshold: 0.05,
                rootMargin: "0px 0px -40px 0px"
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); 
                    }
                });
            }, revealOptions);

            DOM.revealElements.forEach(el => revealObserver.observe(el));
        };

        return { init };
    })();

    // ==========================================================================
    // 10. ANCHOR SHARE
    // ==========================================================================
    const AnchorShare = (() => {
        const init = () => {
            if (!DOM.mainContent) return;
            const headings = DOM.mainContent.querySelectorAll('h2, h3');
            
            headings.forEach(heading => {
                if (!heading.id) return; 

                heading.style.position = 'relative';
                
                const linkBtn = document.createElement('button');
                linkBtn.className = 'copy-anchor-btn sr-only-focusable';
                linkBtn.setAttribute('aria-label', 'Copy link to this section');
                linkBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                `;
                
                linkBtn.style.cssText = `
                    position: absolute; left: -40px; top: 50%; transform: translateY(-50%);
                    background: none; border: none; color: var(--brand-primary); cursor: pointer;
                    opacity: 0; transition: all 0.2s ease; padding: 5px; border-radius: 4px;
                `;

                heading.addEventListener('mouseenter', () => linkBtn.style.opacity = '0.3');
                heading.addEventListener('mouseleave', () => linkBtn.style.opacity = '0');
                
                linkBtn.addEventListener('mouseenter', () => linkBtn.style.opacity = '1');
                linkBtn.addEventListener('focus', () => linkBtn.style.opacity = '1');

                linkBtn.addEventListener('click', () => {
                    const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
                    navigator.clipboard.writeText(url).then(() => {
                        ToastSystem.show('Section link copied to clipboard! 🔗', '📝');
                    });
                });

                heading.appendChild(linkBtn);
            });
        };

        return { init };
    })();

    // ==========================================================================
    // 11. BACK TO TOP HANDLER
    // ==========================================================================
    const BackToTop = (() => {
        const init = () => {
            if (DOM.backToTopBtn) {
                DOM.backToTopBtn.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    DOM.backToTopBtn.blur(); 
                });
            }
        };
        return { init };
    })();

    // ==========================================================================
    // 12. CONFETTI CELEBRATION SYSTEM
    // ==========================================================================
    const ConfettiSystem = (() => {
        const fire = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                pointer-events: none; z-index: 999999;
            `;
            document.body.appendChild(canvas);
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const colors = ['#9f1239', '#fbbf24', '#3b82f6', '#10b981', '#f472b6', '#ffffff'];

            for (let i = 0; i < 200; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height, 
                    size: Math.random() * 10 + 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: Math.random() * 4 + 2,
                    angle: Math.random() * 360,
                    spin: Math.random() * 0.2 - 0.1
                });
            }

            let animationId;

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let active = false;

                particles.forEach(p => {
                    p.y += p.speed;
                    p.angle += p.spin;
                    
                    if (p.y < canvas.height) active = true;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.angle);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                });

                if (active) {
                    animationId = requestAnimationFrame(render);
                } else {
                    cancelAnimationFrame(animationId);
                    canvas.remove(); 
                }
            };

            render();
        };

        return { fire };
    })();

    // ==========================================================================
    // SYSTEM BOOTSTRAP
    // ==========================================================================
    const bootApp = () => {
        try {
            SecuritySystem.init();
            PrintSystem.init();
            ThemeManager.init();
            ContentAnalyzers.init();
            MobileMenu.init();
            ScrollEngine.init();
            ScrollSpy.init();
            Animations.init();
            AnchorShare.init();
            BackToTop.init();
            
            console.log(
                "%c Archive Engine Loaded Successfully \n%c Historical Evolution of Jaunpur - Bug Free UI Systems Online 🚀", 
                "color: #e11d48; font-size: 16px; font-weight: 900; font-family: sans-serif;",
                "color: #64748b; font-size: 12px; font-weight: 500;"
            );
        } catch (error) {
            console.error("Critical Archive System Boot Error:", error);
        }
    };

    bootApp();
});