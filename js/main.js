// Kael Lopez Castillo Examen Parcial 2 TECWEB 1

'use strict';

(function () {
  // Configuracion global, expresiones regulares para validacion y estado de la aplicacion
  const APP_CONFIG = {
    githubUsername: 'Kael-py',
    githubApiUrl: 'https://api.github.com/users/Kael-py/repos?sort=updated&per_page=6',
    storageKeys: {
      theme: 'kael_portfolio_theme_data',
      messages: 'kael_contact_messages_data'
    },
    regex: {
      name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      subject: /^.{4,100}$/,
      message: /^[\s\S]{10,1000}$/
    }
  };

  const appState = {
    activeCategory: 'all',
    searchQuery: '',
    filteredProjects: [],
    theme: 'light',
    messages: []
  };

  const SVG_ICONS = {
    moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`,
    sun: `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`
  };

  // Cache estructurado de referencias a elementos interactivos del DOM
  const DOM = {
    root: document.documentElement,
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeSvgIcon: document.getElementById('theme-svg-icon'),
    themeBtnText: document.getElementById('theme-btn-text'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    primaryMenu: document.getElementById('primary-menu'),

    projectsGrid: document.getElementById('projects-grid'),
    projectSearchInput: document.getElementById('project-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    categoryFilterList: document.getElementById('category-filter-list'),
    projectsLiveCount: document.getElementById('projects-live-count'),
    noProjectsFound: document.getElementById('no-projects-found'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),

    githubReposGrid: document.getElementById('github-repos-grid'),
    githubStatusMessage: document.getElementById('github-status-message'),
    githubRefreshBtn: document.getElementById('github-refresh-btn'),

    contactForm: document.getElementById('contact-form'),
    contactName: document.getElementById('contact-name'),
    contactEmail: document.getElementById('contact-email'),
    contactSubject: document.getElementById('contact-subject'),
    contactMessage: document.getElementById('contact-message'),
    charCounter: document.getElementById('char-counter'),
    formFeedbackAlert: document.getElementById('form-feedback-alert'),
    submitBtnText: document.getElementById('submit-btn-text'),
    savedMessagesCount: document.getElementById('saved-messages-count'),
    clearLocalMessagesBtn: document.getElementById('clear-local-messages-btn'),

    toastNotification: document.getElementById('toast-notification'),
    toastIcon: document.getElementById('toast-icon'),
    toastMessage: document.getElementById('toast-message')
  };

  // Conmutador de tema Dark/Light con persistencia en localStorage (JSON.stringify/parse)
  const ThemeModule = {
    init() {
      let initialTheme = 'light';
      
      try {
        const storedItem = localStorage.getItem(APP_CONFIG.storageKeys.theme);
        if (storedItem) {
          const parsed = JSON.parse(storedItem);
          if (parsed && (parsed.theme === 'dark' || parsed.theme === 'light')) {
            initialTheme = parsed.theme;
          }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          initialTheme = 'dark';
        }
      } catch (err) {
        console.warn('Error al deserializar tema desde LocalStorage:', err);
      }

      this.applyTheme(initialTheme);

      if (DOM.themeToggleBtn) {
        DOM.themeToggleBtn.addEventListener('click', () => {
          const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
          this.applyTheme(nextTheme);
        });
      }

      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const storedItem = localStorage.getItem(APP_CONFIG.storageKeys.theme);
          if (!storedItem) {
            this.applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    },

    applyTheme(theme) {
      appState.theme = theme;
      DOM.root.setAttribute('data-theme', theme);

      try {
        const themePayload = {
          theme: theme,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(APP_CONFIG.storageKeys.theme, JSON.stringify(themePayload));
      } catch (err) {
        console.error('Error al guardar tema en LocalStorage:', err);
      }

      if (DOM.themeToggleBtn) {
        const isDark = theme === 'dark';
        DOM.themeToggleBtn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        DOM.themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');

        if (DOM.themeSvgIcon) {
          DOM.themeSvgIcon.innerHTML = isDark ? SVG_ICONS.sun : SVG_ICONS.moon;
        }
        if (DOM.themeBtnText) {
          DOM.themeBtnText.textContent = isDark ? 'Claro' : 'Oscuro';
        }
      }
    }
  };

  // Menu hamburguesa responsivo con mutacion de aria-expanded
  const NavigationModule = {
    init() {
      if (!DOM.mobileMenuBtn || !DOM.primaryMenu) return;

      DOM.mobileMenuBtn.addEventListener('click', () => {
        const isOpen = DOM.primaryMenu.classList.toggle('is-open');
        DOM.mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      DOM.primaryMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.primaryMenu.classList.contains('is-open')) {
          this.closeMenu();
          DOM.mobileMenuBtn.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (
          DOM.primaryMenu.classList.contains('is-open') &&
          !DOM.primaryMenu.contains(e.target) &&
          !DOM.mobileMenuBtn.contains(e.target)
        ) {
          this.closeMenu();
        }
      });
    },

    closeMenu() {
      if (DOM.primaryMenu) {
        DOM.primaryMenu.classList.remove('is-open');
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  };

  // Filtro dinamico inmutable encadenando .filter() y .map()
  const ProjectsModule = {
    init() {
      if (!window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.projects) {
        console.error('PORTFOLIO_DATA no disponible.');
        return;
      }

      this.setupCategoryPills();
      this.bindEvents();
      this.filterAndRender();
    },

    setupCategoryPills() {
      if (!DOM.categoryFilterList) return;
      DOM.categoryFilterList.innerHTML = '';

      window.PORTFOLIO_DATA.categories.forEach(cat => {
        const li = document.createElement('li');
        li.setAttribute('role', 'presentation');

        const button = document.createElement('button');
        button.type = 'button';
        button.className = `filter-pill ${cat.id === 'all' ? 'is-active' : ''}`;
        button.setAttribute('data-category', cat.id);
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', cat.id === 'all' ? 'true' : 'false');
        button.textContent = cat.label;

        button.addEventListener('click', () => {
          this.setCategory(cat.id);
        });

        li.appendChild(button);
        DOM.categoryFilterList.appendChild(li);
      });
    },

    bindEvents() {
      if (DOM.projectSearchInput) {
        DOM.projectSearchInput.addEventListener('input', (e) => {
          appState.searchQuery = e.target.value.trim().toLowerCase();
          if (DOM.searchClearBtn) {
            DOM.searchClearBtn.hidden = appState.searchQuery.length === 0;
          }
          this.filterAndRender();
        });
      }

      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.addEventListener('click', () => {
          DOM.projectSearchInput.value = '';
          appState.searchQuery = '';
          DOM.searchClearBtn.hidden = true;
          DOM.projectSearchInput.focus();
          this.filterAndRender();
        });
      }

      if (DOM.resetFiltersBtn) {
        DOM.resetFiltersBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }
    },

    setCategory(categoryId) {
      appState.activeCategory = categoryId;

      const pills = DOM.categoryFilterList.querySelectorAll('.filter-pill');
      pills.forEach(pill => {
        const matches = pill.getAttribute('data-category') === categoryId;
        pill.classList.toggle('is-active', matches);
        pill.setAttribute('aria-checked', matches ? 'true' : 'false');
      });

      this.filterAndRender();
    },

    resetFilters() {
      appState.activeCategory = 'all';
      appState.searchQuery = '';
      if (DOM.projectSearchInput) {
        DOM.projectSearchInput.value = '';
      }
      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.hidden = true;
      }
      this.setCategory('all');
    },

    filterAndRender() {
      const allProjects = window.PORTFOLIO_DATA.projects;
      const query = appState.searchQuery;
      const cat = appState.activeCategory;

      const renderedCards = allProjects
        .filter(project => {
          const matchesCategory = (cat === 'all') || (project.category === cat);
          if (!matchesCategory) return false;

          if (!query) return true;

          const titleMatch = project.title.toLowerCase().includes(query);
          const descMatch = project.description.toLowerCase().includes(query);
          const techMatch = project.technologies.some(t => t.toLowerCase().includes(query));
          const catLabelMatch = project.categoryLabel.toLowerCase().includes(query);

          return titleMatch || descMatch || techMatch || catLabelMatch;
        })
        .map(project => {
          const categoryBadgeClass = `category-badge--${project.category}`;

          const highlightsHtml = project.highlights && project.highlights.length > 0
            ? `<ul class="project-highlights" aria-label="Detalles clave del proyecto">
                ${project.highlights.map(h => `<li>${this.escapeHtml(h)}</li>`).join('')}
              </ul>`
            : '';

          const techHtml = project.technologies
            ? `<ul class="tech-pill-list" aria-label="Tecnologías empleadas">
                ${project.technologies.map(t => `<li class="tech-pill">${this.escapeHtml(t)}</li>`).join('')}
              </ul>`
            : '';

          return `
            <article class="project-card" aria-labelledby="proj-title-${project.id}">
              <header class="project-card-header">
                <span class="project-meta-badges">
                  <span class="category-badge ${categoryBadgeClass}">${this.escapeHtml(project.categoryLabel)}</span>
                  <span class="project-scope-badge">${this.escapeHtml(project.badge || 'Proyecto SIS')}</span>
                </span>
              </header>

              <h3 id="proj-title-${project.id}" class="project-title">${this.escapeHtml(project.title)}</h3>
              <p class="project-desc">${this.escapeHtml(project.description)}</p>

              ${highlightsHtml}
              ${techHtml}

              <footer class="project-card-footer">
                <small class="project-footer-context">${this.escapeHtml(project.context || project.award || 'Proyecto UCB La Paz')}</small>
              </footer>
            </article>
          `;
        });

      appState.filteredProjects = renderedCards;
      this.render();
      this.updateStatusOutput(renderedCards.length, allProjects.length);
    },

    render() {
      if (!DOM.projectsGrid) return;

      if (appState.filteredProjects.length === 0) {
        DOM.projectsGrid.innerHTML = '';
        if (DOM.noProjectsFound) DOM.noProjectsFound.hidden = false;
        return;
      }

      if (DOM.noProjectsFound) DOM.noProjectsFound.hidden = true;
      DOM.projectsGrid.innerHTML = appState.filteredProjects.join('');
    },

    updateStatusOutput(filteredCount, totalCount) {
      if (!DOM.projectsLiveCount) return;

      let message = `Mostrando ${filteredCount} de ${totalCount} proyectos.`;
      if (appState.searchQuery) {
        message += ` Filtro de búsqueda: "${appState.searchQuery}".`;
      }
      if (appState.activeCategory !== 'all') {
        const catObj = window.PORTFOLIO_DATA.categories.find(c => c.id === appState.activeCategory);
        if (catObj) {
          message += ` Categoría: ${catObj.label}.`;
        }
      }

      DOM.projectsLiveCount.textContent = message;
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  // Consumo REST con Fetch API, async/await, try/catch, response.ok y estados UI
  const GitHubModule = {
    fallbackRepos: [
      {
        id: 1271625245,
        name: "ExamenFinalCloudKaelLopez",
        html_url: "https://github.com/Kael-py/ExamenFinalCloudKaelLopez",
        description: "Arquitectura Cloud Serverless y Microservicios en AWS. Implementación con Terraform, API Gateway y DynamoDB.",
        language: "Python",
        stargazers_count: 2,
        updated_at: "2026-10-15T18:30:00Z"
      },
      {
        id: 1289192001,
        name: "Control-Colas-Gasolineras-TensorFlow",
        html_url: "https://github.com/Kael-py",
        description: "Proyecto ganador del 1er Lugar WORKSHOP 1 2025 UCB. Modelos de visión artificial y predicción con TensorFlow para estaciones de servicio.",
        language: "Python",
        stargazers_count: 6,
        updated_at: "2026-09-28T14:10:00Z"
      },
      {
        id: 1290234112,
        name: "Gantia-SmartGlove-ESP32",
        html_url: "https://github.com/Kael-py",
        description: "Proyecto destacado WORKSHOP 1 2026 UCB. Guante inteligente con microcontrolador ESP32, sensores y telemetría en MicroPython.",
        language: "Python",
        stargazers_count: 5,
        updated_at: "2026-09-12T09:45:00Z"
      },
      {
        id: 1293345100,
        name: "Testimonios-Bolivia-Cloud-AWS",
        html_url: "https://github.com/Kael-py",
        description: "Migración de infraestructura a AWS para plataforma boliviana. EC2, S3, Docker y AWS Lambda.",
        language: "JavaScript",
        stargazers_count: 3,
        updated_at: "2026-08-20T11:20:00Z"
      },
      {
        id: 1294456201,
        name: "SIS214-Tecnologias-Web-I",
        html_url: "https://github.com/Kael-py",
        description: "Laboratorios prácticos y examen de Tecnologías Web I (SIS-214). Semántica HTML5 pura, CSS3 Responsive y JavaScript ES6+.",
        language: "JavaScript",
        stargazers_count: 2,
        updated_at: "2026-10-17T12:00:00Z"
      },
      {
        id: 1295567302,
        name: "Backend-NodeJS-Docker-API",
        html_url: "https://github.com/Kael-py",
        description: "Servicios del lado del servidor con Node.js y Python, bases de datos SQL relacionales y orquestación con Docker.",
        language: "TypeScript",
        stargazers_count: 4,
        updated_at: "2026-07-15T16:00:00Z"
      }
    ],

    init() {
      if (DOM.githubRefreshBtn) {
        DOM.githubRefreshBtn.addEventListener('click', () => {
          this.fetchRepositories();
        });
      }

      this.fetchRepositories();
    },

    async fetchRepositories() {
      if (!DOM.githubReposGrid) return;

      this.setLoadingState(true, 'Conectando con la API REST de GitHub (@Kael-py)...');

      try {
        const response = await fetch(APP_CONFIG.githubApiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        switch (response.status) {
          case 200: {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              this.renderRepositories(data, 'Estado: Conexión exitosa HTTP 200 (Datos sincronizados desde GitHub API)');
            } else {
              this.renderRepositories(this.fallbackRepos, 'Estado: Modo Portafolio (Proyectos verificados de Kael López)');
            }
            break;
          }
          case 400:
            throw new Error('Solicitud incorrecta a la API (HTTP 400)');
          case 404:
            throw new Error('Usuario o recurso de GitHub no encontrado (HTTP 404)');
          case 500:
          case 502:
          case 503:
            throw new Error(`Error en los servidores de GitHub (HTTP ${response.status})`);
          default:
            if (!response.ok) {
              throw new Error(`Respuesta HTTP no exitosa: Código ${response.status} (${response.statusText})`);
            }
        }
      } catch (error) {
        console.warn('Detalle de consulta GitHub API:', error.message);
        this.renderRepositories(
          this.fallbackRepos,
          `Aviso de conexión: ${error.message}. Mostrando proyectos verificados en modo respaldo.`
        );
      } finally {
        this.setLoadingState(false);
      }
    },

    setLoadingState(isLoading, message = '') {
      if (DOM.githubReposGrid) {
        DOM.githubReposGrid.setAttribute('aria-busy', isLoading ? 'true' : 'false');
      }
      if (DOM.githubStatusMessage && message) {
        DOM.githubStatusMessage.textContent = message;
      }
    },

    renderRepositories(repos, statusText) {
      if (!DOM.githubReposGrid) return;
      DOM.githubReposGrid.innerHTML = '';

      if (DOM.githubStatusMessage) {
        DOM.githubStatusMessage.textContent = statusText;
      }

      const cardsHtml = repos.slice(0, 6).map(repo => {
        const description = repo.description || 'Proyecto de ingeniería de software desarrollado por Kael Alessandro López Castillo.';
        const language = repo.language || 'Tecnologías Web';
        const stars = typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0;
        const updatedDate = repo.updated_at 
          ? new Date(repo.updated_at).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' })
          : 'Reciente';

        return `
          <article class="repo-card" aria-labelledby="repo-title-${repo.id || repo.name}">
            <header class="repo-header">
              <h3 id="repo-title-${repo.id || repo.name}">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name-link" aria-label="Abrir repositorio ${this.escapeHtml(repo.name)} en GitHub">
                  <span>${this.escapeHtml(repo.name)}</span>
                </a>
              </h3>
              <span class="repo-stars" title="${stars} estrellas en GitHub">
                Estrellas: ${stars}
              </span>
            </header>

            <p class="repo-desc">${this.escapeHtml(description)}</p>

            <footer class="repo-meta">
              <span class="repo-language">
                <span class="lang-color-dot" aria-hidden="true"></span>
                <span>${this.escapeHtml(language)}</span>
              </span>
              <time datetime="${repo.updated_at || ''}">Actualizado: ${updatedDate}</time>
            </footer>
          </article>
        `;
      });

      DOM.githubReposGrid.innerHTML = cardsHtml.join('');
    },

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  // Formulario de contacto con preventDefault() y validacion input en tiempo real
  const ContactModule = {
    init() {
      this.loadStoredMessages();
      this.bindEvents();
    },

    bindEvents() {
      if (!DOM.contactForm) return;

      if (DOM.contactName) {
        DOM.contactName.addEventListener('input', () => this.validateField('name'));
        DOM.contactName.addEventListener('blur', () => this.validateField('name'));
      }

      if (DOM.contactEmail) {
        DOM.contactEmail.addEventListener('input', () => this.validateField('email'));
        DOM.contactEmail.addEventListener('blur', () => this.validateField('email'));
      }

      if (DOM.contactSubject) {
        DOM.contactSubject.addEventListener('input', () => this.validateField('subject'));
        DOM.contactSubject.addEventListener('blur', () => this.validateField('subject'));
      }

      if (DOM.contactMessage) {
        DOM.contactMessage.addEventListener('input', () => {
          this.updateCharCounter();
          this.validateField('message');
        });
        DOM.contactMessage.addEventListener('blur', () => this.validateField('message'));
      }

      DOM.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      if (DOM.clearLocalMessagesBtn) {
        DOM.clearLocalMessagesBtn.addEventListener('click', () => {
          this.clearStoredMessages();
        });
      }
    },

    updateCharCounter() {
      if (!DOM.contactMessage || !DOM.charCounter) return;
      const count = DOM.contactMessage.value.length;
      DOM.charCounter.textContent = `${count} / 1000`;
      DOM.charCounter.classList.toggle('is-limit', count >= 950);
    },

    validateField(fieldName) {
      let isValid = true;
      let errorMsg = '';

      switch (fieldName) {
        case 'name': {
          const val = DOM.contactName.value.trim();
          if (!val) {
            isValid = false;
            errorMsg = 'El nombre completo es obligatorio.';
          } else if (val.length < 3) {
            isValid = false;
            errorMsg = 'El nombre debe tener al menos 3 caracteres.';
          } else if (!APP_CONFIG.regex.name.test(val)) {
            isValid = false;
            errorMsg = 'Ingresa un nombre válido (solo letras alfabéticas y espacios).';
          }
          this.applyFieldState(DOM.contactName, 'name-error-msg', isValid, errorMsg);
          break;
        }

        case 'email': {
          const val = DOM.contactEmail.value.trim();
          if (!val) {
            isValid = false;
            errorMsg = 'El correo electrónico es obligatorio.';
          } else if (!APP_CONFIG.regex.email.test(val)) {
            isValid = false;
            errorMsg = 'Ingresa un correo electrónico con formato válido (ej. usuario@dominio.com).';
          }
          this.applyFieldState(DOM.contactEmail, 'email-error-msg', isValid, errorMsg);
          break;
        }

        case 'subject': {
          const val = DOM.contactSubject.value.trim();
          if (!val) {
            isValid = false;
            errorMsg = 'El asunto de la consulta es obligatorio.';
          } else if (val.length < 4) {
            isValid = false;
            errorMsg = 'El asunto debe contener al menos 4 caracteres.';
          } else if (val.length > 100) {
            isValid = false;
            errorMsg = 'El asunto no puede exceder 100 caracteres.';
          }
          this.applyFieldState(DOM.contactSubject, 'subject-error-msg', isValid, errorMsg);
          break;
        }

        case 'message': {
          const val = DOM.contactMessage.value.trim();
          if (!val) {
            isValid = false;
            errorMsg = 'El mensaje detallado es obligatorio.';
          } else if (val.length < 10) {
            isValid = false;
            errorMsg = `El mensaje debe contener al menos 10 caracteres (actual: ${val.length}).`;
          } else if (val.length > 1000) {
            isValid = false;
            errorMsg = 'El mensaje no puede exceder los 1000 caracteres permitidos.';
          }
          this.applyFieldState(DOM.contactMessage, 'message-error-msg', isValid, errorMsg);
          break;
        }
      }

      return isValid;
    },

    applyFieldState(inputElement, errorElementId, isValid, errorMsg) {
      if (!inputElement) return;
      const errorElement = document.getElementById(errorElementId);

      inputElement.classList.toggle('is-valid', isValid);
      inputElement.classList.toggle('is-invalid', !isValid);
      inputElement.setAttribute('aria-invalid', isValid ? 'false' : 'true');

      if (errorElement) {
        errorElement.textContent = isValid ? '' : errorMsg;
      }
    },

    validateAll() {
      const isNameValid = this.validateField('name');
      const isEmailValid = this.validateField('email');
      const isSubjectValid = this.validateField('subject');
      const isMessageValid = this.validateField('message');

      return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
    },

    handleSubmit() {
      const allValid = this.validateAll();

      if (!allValid) {
        this.showFormAlert('Por favor, revisa y corrige los campos marcados antes de enviar.', 'error');
        const firstInvalid = DOM.contactForm.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      const newMessage = {
        id: 'msg_' + Date.now(),
        fullName: DOM.contactName.value.trim(),
        email: DOM.contactEmail.value.trim(),
        subject: DOM.contactSubject.value.trim(),
        message: DOM.contactMessage.value.trim(),
        submittedAt: new Date().toISOString(),
        localeDate: new Date().toLocaleString('es-BO')
      };

      this.saveMessageToStorage(newMessage);

      this.showFormAlert('Mensaje registrado con éxito. Se guardó una copia en la bandeja local de tu navegador.', 'success');
      ToastModule.show(`Mensaje de ${newMessage.fullName} almacenado en LocalStorage`, 'OK');

      DOM.contactForm.reset();
      this.resetValidationClasses();
      this.updateCharCounter();
    },

    resetValidationClasses() {
      const inputs = [DOM.contactName, DOM.contactEmail, DOM.contactSubject, DOM.contactMessage];
      inputs.forEach(input => {
        if (input) {
          input.classList.remove('is-valid', 'is-invalid');
          input.removeAttribute('aria-invalid');
        }
      });

      const errorIds = ['name-error-msg', 'email-error-msg', 'subject-error-msg', 'message-error-msg'];
      errorIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });
    },

    showFormAlert(message, type) {
      if (!DOM.formFeedbackAlert) return;
      DOM.formFeedbackAlert.textContent = message;
      DOM.formFeedbackAlert.className = `form-alert form-alert--${type}`;
      DOM.formFeedbackAlert.hidden = false;

      setTimeout(() => {
        if (DOM.formFeedbackAlert) {
          DOM.formFeedbackAlert.hidden = true;
        }
      }, 6000);
    },

    saveMessageToStorage(messageObj) {
      try {
        const stored = localStorage.getItem(APP_CONFIG.storageKeys.messages);
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(messageObj);
        localStorage.setItem(APP_CONFIG.storageKeys.messages, JSON.stringify(list));
        appState.messages = list;
        this.updateStoredMessagesCounter();
      } catch (err) {
        console.error('Error al guardar mensaje en LocalStorage:', err);
      }
    },

    loadStoredMessages() {
      try {
        const stored = localStorage.getItem(APP_CONFIG.storageKeys.messages);
        appState.messages = stored ? JSON.parse(stored) : [];
        this.updateStoredMessagesCounter();
      } catch (err) {
        console.warn('Error al leer mensajes de LocalStorage:', err);
        appState.messages = [];
      }
    },

    updateStoredMessagesCounter() {
      if (!DOM.savedMessagesCount) return;
      const count = appState.messages.length;
      DOM.savedMessagesCount.textContent = count === 1 ? '1 mensaje registrado' : `${count} mensajes registrados`;
    },

    clearStoredMessages() {
      if (appState.messages.length === 0) {
        ToastModule.show('La bandeja local ya está vacía', 'Info');
        return;
      }

      if (window.confirm('¿Confirmas que deseas vaciar los mensajes guardados localmente?')) {
        localStorage.removeItem(APP_CONFIG.storageKeys.messages);
        appState.messages = [];
        this.updateStoredMessagesCounter();
        ToastModule.show('Bandeja de mensajes de LocalStorage vaciada', 'Limpieza');
      }
    }
  };

  // Notificaciones toast accesibles con atributos WAI-ARIA y temporizador
  const ToastModule = {
    timerId: null,

    show(message, tag = 'OK') {
      if (!DOM.toastNotification || !DOM.toastMessage) return;

      if (DOM.toastIcon) DOM.toastIcon.textContent = tag;
      DOM.toastMessage.textContent = message;
      DOM.toastNotification.hidden = false;

      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(() => {
        DOM.toastNotification.hidden = true;
      }, 4500);
    }
  };

  // Inicializacion del ciclo de vida y orquestacion modular al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    ThemeModule.init();
    NavigationModule.init();
    ProjectsModule.init();
    GitHubModule.init();
    ContactModule.init();

    console.info('Portafolio Profesional de Kael Alessandro López Castillo (UCB San Pablo - SIS-214) inicializado con éxito.');
  });

})();
