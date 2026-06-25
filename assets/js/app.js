// App.js - NinjaAcademy Escola Course Explorer and Simulator logic

document.addEventListener('DOMContentLoaded', () => {
  // Course Database
  const courses = [
    {
      id: "fullstack",
      title: "Desenvolvedor Web Fullstack",
      category: "tech",
      duration: "12 meses",
      price: 299.00,
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      desc: "Domine HTML, CSS, JavaScript, React, Node.js e bancos de dados do absoluto zero."
    },
    {
      id: "uxui",
      title: "Formação em UX/UI Design",
      category: "design",
      duration: "6 meses",
      price: 199.00,
      image: "https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=80",
      desc: "Crie interfaces incríveis e experiências inesquecíveis baseadas em pesquisas de usuários."
    },
    {
      id: "datascience",
      title: "Data Science & Inteligência Artificial",
      category: "tech",
      duration: "9 meses",
      price: 249.00,
      image: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=600&auto=format&fit=crop&q=80",
      desc: "Aprenda Python, Machine Learning e análise estatística para prever tendências reais."
    },
    {
      id: "marketing",
      title: "Marketing Digital de Resultados",
      category: "business",
      duration: "4 meses",
      price: 149.00,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
      desc: "Aprenda tráfego pago, SEO, copywriting e estratégias de lançamentos de produtos."
    },
    {
      id: "pm",
      title: "Product Management & Agile",
      category: "business",
      duration: "6 meses",
      price: 220.00,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
      desc: "Domine o ciclo de vida do produto, OKRs, roadmaps e metodologias ágeis de liderança."
    },
    {
      id: "mobile",
      title: "Desenvolvimento Mobile Multiplataforma",
      category: "tech",
      duration: "8 meses",
      price: 279.00,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
      desc: "Crie apps modernos e fluidos para Android e iOS utilizando React Native e Flutter."
    }
  ];

  // DOM Elements
  const searchInput = document.getElementById('search-course');
  const categorySelect = document.getElementById('category-filter');
  const coursesGrid = document.getElementById('courses-grid');
  
  const simCourseSelect = document.getElementById('sim-course');
  const simPlanSelect = document.getElementById('sim-plan');
  const simMentorshipCheck = document.getElementById('sim-mentorship');
  const simCertCheck = document.getElementById('sim-certificate');
  
  const breakdownBasePrice = document.getElementById('breakdown-base');
  const breakdownDiscount = document.getElementById('breakdown-discount');
  const breakdownAddons = document.getElementById('breakdown-addons');
  const breakdownTotal = document.getElementById('breakdown-total');
  
  const enrollmentForm = document.getElementById('enrollment-form');
  const enrollmentSuccess = document.getElementById('enrollment-success');

  // Load courses in selection menu for the simulator
  function populateSimulatorOptions() {
    simCourseSelect.innerHTML = '';
    courses.forEach(course => {
      const option = document.createElement('option');
      option.value = course.id;
      option.textContent = `${course.title} (R$ ${course.price.toFixed(2)}/mês)`;
      simCourseSelect.appendChild(option);
    });
  }

  // Render course list
  function renderCourses(filteredCourses) {
    coursesGrid.innerHTML = '';
    
    if (filteredCourses.length === 0) {
      coursesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 20px; color: var(--color-primary);"></i>
          <h3>Nenhum curso encontrado</h3>
          <p>Tente buscar por termos diferentes ou selecione outra categoria.</p>
        </div>
      `;
      return;
    }

    filteredCourses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="course-header" style="background-image: linear-gradient(0deg, rgba(18,11,45,0.9) 0%, rgba(18,11,45,0.4) 60%), url('${course.image}');">
          <span class="course-badge">${course.category === 'tech' ? 'Tecnologia' : course.category === 'design' ? 'Design' : 'Negócios'}</span>
        </div>
        <div class="course-body">
          <div>
            <h3 class="course-card-title">${course.title}</h3>
            <p class="course-card-desc">${course.desc}</p>
          </div>
          <div class="course-meta">
            <span><i class="fa-regular fa-clock"></i> Duração: ${course.duration}</span>
            <span class="course-price">R$ ${course.price.toFixed(0)}<small>/mês</small></span>
          </div>
          <button class="btn-primary btn-select-course" data-id="${course.id}" style="width: 100%; margin-top: 20px; padding: 10px 0; font-size: 0.9rem;">
            Matricular-se / Simular
          </button>
        </div>
      `;
      coursesGrid.appendChild(card);
    });

    // Add events to matricular-se buttons
    document.querySelectorAll('.btn-select-course').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        simCourseSelect.value = id;
        updateSimulatorCalculator();
        document.getElementById('simulador').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // Filter logic
  function filterCourses() {
    const searchVal = searchInput.value.toLowerCase();
    const categoryVal = categorySelect.value;

    const filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchVal) || course.desc.toLowerCase().includes(searchVal);
      const matchesCategory = categoryVal === 'all' || course.category === categoryVal;
      return matchesSearch && matchesCategory;
    });

    renderCourses(filtered);
  }

  // Simulator Calculator logic
  function updateSimulatorCalculator() {
    const selectedCourseId = simCourseSelect.value;
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    
    if (!selectedCourse) return;

    const basePrice = selectedCourse.price;
    const plan = simPlanSelect.value;

    let discountPercent = 0;
    let months = 1;
    
    if (plan === 'semiannual') {
      discountPercent = 10;
      months = 6;
    } else if (plan === 'annual') {
      discountPercent = 20;
      months = 12;
    }

    const discountAmount = (basePrice * discountPercent) / 100;
    const monthlyFinalPrice = basePrice - discountAmount;
    
    // Addons
    let addonsTotalMonthly = 0;
    let addonsTotalOneTime = 0;

    if (simMentorshipCheck.checked) {
      addonsTotalMonthly += 99.00;
    }
    if (simCertCheck.checked) {
      addonsTotalOneTime += 150.00;
    }

    // Calculations
    const monthlyTotal = monthlyFinalPrice + addonsTotalMonthly;
    const overallTotal = (monthlyTotal * months) + addonsTotalOneTime;

    // Render Breakdown UI
    breakdownBasePrice.textContent = `R$ ${basePrice.toFixed(2)}`;
    breakdownDiscount.textContent = discountPercent > 0 ? `-${discountPercent}% (-R$ ${discountAmount.toFixed(2)})` : 'Nenhum';
    
    let addonsText = '';
    if (simMentorshipCheck.checked) addonsText += 'Mentoria 1-on-1 (+R$99/mês) ';
    if (simCertCheck.checked) addonsText += 'Certificado Físico (+R$150) ';
    breakdownAddons.textContent = addonsText || 'Nenhum';

    breakdownTotal.textContent = `R$ ${overallTotal.toFixed(2)} (${months}x R$ ${monthlyTotal.toFixed(2)}${addonsTotalOneTime > 0 ? ' + R$150 certificado' : ''})`;
  }

  // Event listeners
  searchInput.addEventListener('input', filterCourses);
  categorySelect.addEventListener('change', filterCourses);

  simCourseSelect.addEventListener('change', updateSimulatorCalculator);
  simPlanSelect.addEventListener('change', updateSimulatorCalculator);
  simMentorshipCheck.addEventListener('change', updateSimulatorCalculator);
  simCertCheck.addEventListener('change', updateSimulatorCalculator);

  // Form enrollment submission
  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('student-name').value;
      const email = document.getElementById('student-email').value;
      const courseTitle = simCourseSelect.options[simCourseSelect.selectedIndex].text;
      const planTitle = simPlanSelect.options[simPlanSelect.selectedIndex].text;

      enrollmentSuccess.innerHTML = `
        <strong>Pré-Matrícula Realizada com Sucesso!</strong><br>
        Parabéns, <strong>${name}</strong>! Enviamos as credenciais de acesso e informações de pagamento para <strong>${email}</strong>.<br>
        Curso: <strong>${courseTitle}</strong> | Plano: <strong>${planTitle}</strong>.
      `;
      enrollmentSuccess.style.display = 'block';

      enrollmentForm.reset();
      updateSimulatorCalculator();

      enrollmentSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        enrollmentSuccess.style.display = 'none';
      }, 12000);
    });
  }

  // Initial Runs
  populateSimulatorOptions();
  renderCourses(courses);
  updateSimulatorCalculator();
});
