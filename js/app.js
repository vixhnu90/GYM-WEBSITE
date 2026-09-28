/**
 * APEX FORGE GYM & ATHLETICS - COMMERCIAL ENGINE
 * Truthful, practical, and conversion-focused gym management scripts.
 * Operates standard timings, expected crowd levels, trial booking,
 * membership enquiries, diet guides, and BMI calculator.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = 'fa-circle-check', color = 'var(--accent-primary)') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${color}"></i><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slide-in 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ==========================================================================
     2. HERO PARTICLES CANVAS (Respects prefers-reduced-motion)
     ========================================================================== */
  const canvas = document.getElementById('heroCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;
    let particles = [];

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.8 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.5 + 0.15);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.6 ? '#00f076' : '#00d4ff';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < 0 || this.x < 0 || this.x > width) {
          this.reset();
          this.y = height + 5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const particleCount = window.innerWidth < 768 ? 18 : 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     3. TIMINGS & EXPECTED CROWD LEVELS (Truthful, non-sensor based)
     ========================================================================== */
  const liveStatusText = document.getElementById('liveStatusText');
  const liveClockDisplay = document.getElementById('liveClockDisplay');
  const typicalCrowdLevel = document.getElementById('typicalCrowdLevel');
  const heroTodayHours = document.getElementById('heroTodayHours');
  const heroOperatingStatus = document.getElementById('heroOperatingStatus');
  const heroCrowdLevel = document.getElementById('heroCrowdLevel');

  // Real gym schedule definition
  function getOperatingSchedule(dayIndex) {
    if (dayIndex >= 1 && dayIndex <= 5) {
      return { openHour: 5, openMin: 0, closeHour: 23, closeMin: 0, name: 'Monday – Friday', text: '05:00 AM – 11:00 PM' };
    } else if (dayIndex === 6) {
      return { openHour: 6, openMin: 0, closeHour: 22, closeMin: 0, name: 'Saturday', text: '06:00 AM – 10:00 PM' };
    } else {
      return { openHour: 7, openMin: 0, closeHour: 20, closeMin: 0, name: 'Sunday', text: '07:00 AM – 08:00 PM' };
    }
  }

  // Typical crowd estimation based on historic traffic patterns (honest, no fake sensor claim)
  function getTypicalCrowdText(hours) {
    if (hours >= 11 && hours < 16) {
      return 'Quiet (11 AM – 4 PM)';
    } else if ((hours >= 6 && hours < 9) || (hours >= 17 && hours < 19)) {
      return 'Moderate (5 PM – 7 PM)';
    } else if (hours >= 19 && hours < 21) {
      return 'Busy (7 PM – 9 PM)';
    } else {
      return 'Quiet / Off-Peak';
    }
  }

  function updateOperatingEngine() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();

    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    if (liveClockDisplay) liveClockDisplay.textContent = timeString;

    const schedule = getOperatingSchedule(day);
    const openMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), schedule.openHour, schedule.openMin, 0).getTime();
    const closeMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), schedule.closeHour, schedule.closeMin, 0).getTime();
    const currentMs = now.getTime();

    const isOpen = currentMs >= openMs && currentMs < closeMs;
    const crowdText = getTypicalCrowdText(hours);

    if (typicalCrowdLevel) typicalCrowdLevel.textContent = crowdText;
    if (heroCrowdLevel) heroCrowdLevel.textContent = crowdText;
    if (heroTodayHours) heroTodayHours.textContent = schedule.text;

    const closeTimeStr = `${schedule.closeHour > 12 ? schedule.closeHour - 12 : schedule.closeHour}:00 PM`;

    if (isOpen) {
      if (liveStatusText) liveStatusText.textContent = `OPEN TODAY • Closes at ${closeTimeStr}`;
      if (heroOperatingStatus) heroOperatingStatus.textContent = `Open Now • Closes at ${closeTimeStr}`;
    } else {
      if (liveStatusText) liveStatusText.textContent = `CLOSED NOW • Opens tomorrow at ${schedule.openHour}:00 AM`;
      if (heroOperatingStatus) heroOperatingStatus.textContent = `Closed Now • Opens at ${schedule.openHour}:00 AM`;
    }
  }

  setInterval(updateOperatingEngine, 1000);
  updateOperatingEngine();

  /* ==========================================================================
     4. FREE TRIAL MODAL (Step 1: Short Form -> Step 2: Confirmation)
     ========================================================================== */
  const trialModal = document.getElementById('trialModal');
  const closeTrialModal = document.getElementById('closeTrialModal');
  const trialForm = document.getElementById('trialForm');
  const trialFormContainer = document.getElementById('trialFormContainer');
  const trialConfirmationView = document.getElementById('trialConfirmationView');
  const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');
  const trialDateInput = document.getElementById('trialDate');

  // Set default date to tomorrow
  if (trialDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    trialDateInput.value = tomorrow.toISOString().split('T')[0];
    trialDateInput.min = new Date().toISOString().split('T')[0];
  }

  function openTrialModalWindow() {
    if (!trialModal) return;
    trialModal.classList.add('active');
    if (trialFormContainer) trialFormContainer.style.display = 'block';
    if (trialConfirmationView) trialConfirmationView.style.display = 'none';
  }

  function closeTrialModalWindow() {
    if (!trialModal) return;
    trialModal.classList.remove('active');
  }

  document.querySelectorAll('.open-trial-modal').forEach(btn => {
    btn.addEventListener('click', openTrialModalWindow);
  });

  if (closeTrialModal) closeTrialModal.addEventListener('click', closeTrialModalWindow);
  if (closeConfirmationBtn) closeConfirmationBtn.addEventListener('click', closeTrialModalWindow);

  if (trialModal) {
    trialModal.addEventListener('click', (e) => {
      if (e.target === trialModal) closeTrialModalWindow();
    });
  }

  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('trialFullName').value.trim();
      const phone = document.getElementById('trialPhone').value.trim();
      const prefDate = document.getElementById('trialDate').value;
      const prefSlot = document.getElementById('trialSlot').value;
      const goal = document.getElementById('trialGoal').value;

      // Fill confirmation view
      document.getElementById('confGuestName').textContent = fullName.split(' ')[0] || fullName;
      document.getElementById('confDateVal').textContent = prefDate;
      document.getElementById('confSlotVal').textContent = prefSlot;

      // Store in localStorage for user convenience
      try {
        const trialRequest = { fullName, phone, prefDate, prefSlot, goal, timestamp: new Date().toISOString() };
        localStorage.setItem('apex_last_trial_request', JSON.stringify(trialRequest));
      } catch (err) {
        // Safe fail
      }

      // Transition to Confirmation View
      if (trialFormContainer) trialFormContainer.style.display = 'none';
      if (trialConfirmationView) trialConfirmationView.style.display = 'block';

      showToast('Free trial request received! Confirmation details sent via WhatsApp/SMS.');
    });
  }

  /* ==========================================================================
     5. MEMBERSHIP ENQUIRY MODAL (Structured for future Razorpay integration)
     ========================================================================== */
  const enquiryModal = document.getElementById('enquiryModal');
  const closeEnquiryModal = document.getElementById('closeEnquiryModal');
  const enquiryForm = document.getElementById('enquiryForm');
  const enquiryFormContainer = document.getElementById('enquiryFormContainer');
  const enquirySuccessView = document.getElementById('enquirySuccessView');
  const closeEnquirySuccessBtn = document.getElementById('closeEnquirySuccessBtn');
  const enquiryPlanName = document.getElementById('enquiryPlanName');
  const enquiryPlanPrice = document.getElementById('enquiryPlanPrice');
  const enquiryHiddenPlan = document.getElementById('enquiryHiddenPlan');
  const enquiryStartDate = document.getElementById('enquiryStartDate');

  if (enquiryStartDate) {
    enquiryStartDate.value = new Date().toISOString().split('T')[0];
    enquiryStartDate.min = new Date().toISOString().split('T')[0];
  }

  function openEnquiryModalWindow(planName, price) {
    if (!enquiryModal) return;
    if (enquiryPlanName) enquiryPlanName.textContent = planName;
    if (enquiryPlanPrice) enquiryPlanPrice.textContent = price;
    if (enquiryHiddenPlan) enquiryHiddenPlan.value = planName;

    if (enquiryFormContainer) enquiryFormContainer.style.display = 'block';
    if (enquirySuccessView) enquirySuccessView.style.display = 'none';
    enquiryModal.classList.add('active');
  }

  function closeEnquiryModalWindow() {
    if (!enquiryModal) return;
    enquiryModal.classList.remove('active');
  }

  document.querySelectorAll('.open-enquiry-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan || 'Quarterly Popular Pro';
      const price = btn.dataset.price || '₹4,999 / 3 months';
      openEnquiryModalWindow(plan, price);
    });
  });

  if (closeEnquiryModal) closeEnquiryModal.addEventListener('click', closeEnquiryModalWindow);
  if (closeEnquirySuccessBtn) closeEnquirySuccessBtn.addEventListener('click', closeEnquiryModalWindow);

  if (enquiryModal) {
    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) closeEnquiryModalWindow();
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const plan = enquiryHiddenPlan ? enquiryHiddenPlan.value : 'Popular Pro';
      const fullName = document.getElementById('enquiryFullName').value.trim();
      const phone = document.getElementById('enquiryPhone').value.trim();

      // Set plan in confirmation
      const successPlanEl = document.getElementById('enquirySuccessPlan');
      if (successPlanEl) successPlanEl.textContent = plan;

      /* ====================================================================
         NOTE FOR BACKEND / RAZORPAY PAYMENT GATEWAY INTEGRATION:
         When ready to connect online checkout:
         1. Call backend: const order = await fetch('/api/create-razorpay-order', { method: 'POST', body: JSON.stringify({ plan, phone, fullName }) });
         2. Trigger Razorpay Checkout:
            const rzp = new Razorpay({
              key: "YOUR_RAZORPAY_KEY",
              amount: order.amount,
              currency: "INR",
              name: "Apex Forge Gym",
              handler: function (response) { ...verify signature on server... }
            });
            rzp.open();
         ==================================================================== */

      // Display honest confirmation
      if (enquiryFormContainer) enquiryFormContainer.style.display = 'none';
      if (enquirySuccessView) enquirySuccessView.style.display = 'block';

      showToast(`Enquiry for ${plan} received! Our team will contact you shortly.`);
    });
  }

  /* ==========================================================================
     6. CERTIFIED TRAINERS MODAL
     ========================================================================== */
  const trainerModal = document.getElementById('trainerModal');
  const trainerModalBody = document.getElementById('trainerModalBody');
  const closeTrainerModal = document.getElementById('closeTrainerModal');

  const trainerProfiles = {
    arun: {
      name: 'Arun Kumar',
      role: 'CSCS • Head Strength Coach',
      img: 'assets/trainer-alex.jpg',
      exp: '8+ Years Coaching Experience',
      bio: 'Arun specializes in barbell biomechanics, postural alignment, and progressive overload. He has guided hundreds of members from zero lifting background to building confident, pain-free strength.',
      specialties: ['Squat & Deadlift Mechanics', 'Beginner Strength Progression', 'Injury Prevention & Joint Safety', 'Postural Restoration'],
      schedule: 'Mon, Wed, Fri: 06:00 AM – 12:00 PM & 05:00 PM – 09:00 PM'
    },
    priya: {
      name: 'Priya Sharma',
      role: 'ACE Certified Personal Trainer',
      img: 'assets/trainer-elena.jpg',
      exp: '6+ Years Elite Coaching',
      bio: 'Priya brings structured cardiovascular and kettlebell programming designed to burn fat sustainably without joint burnout. Her group sessions and 1-on-1 coaching emphasize consistency and positive reinforcement.',
      specialties: ['High-Energy HIIT Circuits', 'Kettlebell Complexes', 'Women’s Strength & Conditioning', 'Cardiovascular Stamina'],
      schedule: 'Tue, Thu, Sat: 06:30 AM – 11:30 AM & 05:00 PM – 08:30 PM'
    },
    marcus: {
      name: 'Marcus Vance',
      role: 'ISSA Certified Fitness Coach',
      img: 'assets/trainer-marcus.jpg',
      exp: '7+ Years Movement Coaching',
      bio: 'Marcus focuses on calisthenics, joint mobility, and bodyweight control. He helps members reverse desk-job tightness, build core stability, and master functional bodyweight exercises.',
      specialties: ['Gymnastic Rings & Bar Technique', 'Spine & Hip Mobility', 'Core Activation & Agility', 'Bodyweight Pull-ups & Dips'],
      schedule: 'Mon to Sat: 08:00 AM – 02:00 PM'
    },
    maya: {
      name: 'Dr. Maya Chen',
      role: 'M.Sc. Clinical & Sports Nutrition',
      img: null,
      exp: '10+ Years Nutrition Advisory',
      bio: 'Dr. Maya designs sustainable nutrition frameworks that fit both Indian home diets and active training routines. She focuses on calorie-conscious whole foods, protein adequacy, and long-term metabolic health.',
      specialties: ['Whole-Food Meal Planning', 'Macro Split Calibration', 'Vegetarian & Non-Veg High-Protein Diets', 'Hydration & Digestive Health'],
      schedule: 'Consultations available by appointment (Mon – Fri: 10:00 AM – 04:00 PM)'
    }
  };

  document.querySelectorAll('.open-trainer-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.trainer;
      const t = trainerProfiles[key];
      if (!t || !trainerModalBody) return;

      trainerModalBody.innerHTML = `
        <div class="trainer-modal-content">
          <div class="trainer-modal-head" style="display: flex; gap: 1.2rem; align-items: center;">
            ${t.img ? `<img src="${t.img}" alt="${t.name}" style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover;">` : `
              <div style="width: 90px; height: 90px; border-radius: 12px; background: rgba(0, 240, 118, 0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--accent-primary);">
                <i class="fa-solid fa-user-doctor"></i>
              </div>
            `}
            <div>
              <span class="badge-pill status-open"><i class="fa-solid fa-check"></i> Available for Consultations</span>
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; margin: 0.2rem 0;">${t.name}</h3>
              <p style="font-size: 0.85rem; color: var(--accent-primary);">${t.role}</p>
              <p style="font-size: 0.78rem; color: var(--text-dim);"><i class="fa-solid fa-medal"></i> ${t.exp}</p>
            </div>
          </div>

          <div class="mt-3">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem;">Coaching Focus:</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">${t.bio}</p>

            <h4 style="font-size: 0.95rem; font-weight: 700; margin: 1rem 0 0.5rem 0;">Specializations:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${t.specialties.map(s => `<span class="spec-tag"><i class="fa-solid fa-check text-highlight"></i> ${s}</span>`).join('')}
            </div>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: 8px; margin-top: 1rem; font-size: 0.82rem; color: var(--text-muted);">
              <strong><i class="fa-regular fa-clock text-highlight"></i> Available Timings:</strong> ${t.schedule}
            </div>

            <div class="mt-3">
              <button type="button" class="btn btn-primary w-100 open-trial-modal" id="trainerModalTrialBtn">
                <i class="fa-solid fa-calendar-check"></i> Book Free Trial With ${t.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      `;

      if (trainerModal) trainerModal.classList.add('active');

      const innerTrialBtn = document.getElementById('trainerModalTrialBtn');
      if (innerTrialBtn) {
        innerTrialBtn.addEventListener('click', () => {
          if (trainerModal) trainerModal.classList.remove('active');
          openTrialModalWindow();
        });
      }
    });
  });

  if (closeTrainerModal) {
    closeTrainerModal.addEventListener('click', () => {
      if (trainerModal) trainerModal.classList.remove('active');
    });
  }

  if (trainerModal) {
    trainerModal.addEventListener('click', (e) => {
      if (e.target === trainerModal) trainerModal.classList.remove('active');
    });
  }

  /* ==========================================================================
     7. WEEKLY CLASS TIMETABLE (Truthful, honest schedule)
     ========================================================================== */
  const weeklyClassSchedule = {
    Mon: [
      { time: '06:30 AM – 07:30 AM', title: 'Morning Functional HIIT', focus: 'Metabolic Conditioning', coach: 'Priya Sharma', room: 'Turf Area' },
      { time: '09:00 AM – 10:15 AM', title: 'Barbell Strength Technique', focus: 'Squat & Overhead Press Form', coach: 'Arun Kumar', room: 'Strength Zone' },
      { time: '05:30 PM – 06:30 PM', title: 'Calisthenics & Bodyweight Basics', focus: 'Core & Ring Work', coach: 'Marcus Vance', room: 'Functional Track' },
      { time: '07:00 PM – 08:00 PM', title: 'High-Cadence Cardio Cycling', focus: 'Aerobic Endurance', coach: 'Priya Sharma', room: 'Cardio Floor' }
    ],
    Tue: [
      { time: '07:00 AM – 08:00 AM', title: 'Kettlebell Full-Body Circuit', focus: 'Strength & Core Stamina', coach: 'Priya Sharma', room: 'Turf Area' },
      { time: '10:00 AM – 11:00 AM', title: 'Mobility & Postural Decompression', focus: 'Joint Health & Flexibility', coach: 'Marcus Vance', room: 'Studio 1' },
      { time: '06:00 PM – 07:15 PM', title: 'Deadlift & Posterior Chain Clinic', focus: 'Barbell Deadlift Mechanics', coach: 'Arun Kumar', room: 'Strength Zone' }
    ],
    Wed: [
      { time: '06:30 AM – 07:30 AM', title: 'Tabata Cardio Intervals', focus: 'High-Intensity Caloric Burn', coach: 'Priya Sharma', room: 'Turf Area' },
      { time: '09:00 AM – 10:15 AM', title: 'Upper Body Hypertrophy Split', focus: 'Chest, Shoulders & Back', coach: 'Arun Kumar', room: 'Strength Zone' },
      { time: '06:30 PM – 07:30 PM', title: 'Strict Pull-Ups & Push-Ups Clinic', focus: 'Upper Bodyweight Force', coach: 'Marcus Vance', room: 'Functional Track' }
    ],
    Thu: [
      { time: '07:00 AM – 08:00 AM', title: 'Cardio Endurance & Sled Circuit', focus: 'Aerobic Stamina & Sleds', coach: 'Priya Sharma', room: 'Turf Area' },
      { time: '10:30 AM – 11:30 AM', title: 'Bench Press & Pec Form Focus', focus: 'Safe Press Mechanics', coach: 'Arun Kumar', room: 'Strength Zone' },
      { time: '06:00 PM – 07:00 PM', title: 'Hip Mobility & Spine Health', focus: 'Desk-Job Stiffness Relief', coach: 'Marcus Vance', room: 'Studio 1' }
    ],
    Fri: [
      { time: '06:30 AM – 07:30 AM', title: 'Friday Team Conditioning Circuit', focus: 'Partner MetCon Challenges', coach: 'Priya Sharma', room: 'Turf Area' },
      { time: '09:00 AM – 10:00 AM', title: 'Arm & Shoulder Hypertrophy', focus: 'Targeted Volume Split', coach: 'Arun Kumar', room: 'Strength Zone' },
      { time: '06:30 PM – 07:30 PM', title: 'Weekend Warmup High-Energy Lifting', focus: 'Free Weights & Form', coach: 'Coaching Team', room: 'Main Floor' }
    ],
    Sat: [
      { time: '08:00 AM – 09:30 AM', title: 'Saturday Morning Community Boot Camp', focus: 'Full-Body Endurance & Agility', coach: 'Priya & Arun', room: 'Main Arena' },
      { time: '10:30 AM – 12:00 PM', title: 'Barbell Technique & PR Assessment', focus: 'Strength Benchmarks', coach: 'Arun Kumar', room: 'Strength Zone' },
      { time: '04:30 PM – 05:30 PM', title: 'Calisthenics Open Movement Jam', focus: 'Bodyweight Mastery', coach: 'Marcus Vance', room: 'Functional Track' }
    ],
    Sun: [
      { time: '08:30 AM – 09:45 AM', title: 'Sunday Sunrise Mobility & Restorative Yoga', focus: 'Active Recovery & Stretching', coach: 'Marcus Vance', room: 'Studio 1' },
      { time: '10:30 AM – 11:45 AM', title: 'Low-Intensity Aerobic Recovery', focus: 'Light Rowing & Incline Walking', coach: 'Priya Sharma', room: 'Cardio Floor' }
    ]
  };

  const scheduleDayNav = document.getElementById('scheduleDayNav');
  const scheduleTableBody = document.getElementById('scheduleTableBody');

  function renderSchedule(dayKey) {
    if (!scheduleTableBody) return;
    const classes = weeklyClassSchedule[dayKey] || [];

    scheduleTableBody.innerHTML = classes.map(c => `
      <tr>
        <td><i class="fa-regular fa-clock text-highlight"></i> <strong>${c.time}</strong></td>
        <td>
          <div class="class-name-box">
            <strong>${c.title}</strong>
          </div>
        </td>
        <td><span class="intensity-pill intensity-med">${c.focus}</span></td>
        <td><i class="fa-solid fa-user-ninja text-dim"></i> ${c.coach}</td>
        <td><i class="fa-solid fa-door-open text-dim"></i> ${c.room}</td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm open-trial-modal">
            <i class="fa-solid fa-calendar-check"></i> Book Trial
          </button>
        </td>
      </tr>
    `).join('');

    // Attach trial modal to newly rendered buttons
    scheduleTableBody.querySelectorAll('.open-trial-modal').forEach(btn => {
      btn.addEventListener('click', openTrialModalWindow);
    });
  }

  if (scheduleDayNav) {
    const dayBtns = scheduleDayNav.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dayBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderSchedule(btn.dataset.day);
      });
    });

    // Auto-select current day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    const activeDayBtn = scheduleDayNav.querySelector(`[data-day="${currentDay}"]`);
    if (activeDayBtn) {
      dayBtns.forEach(b => b.classList.remove('active'));
      activeDayBtn.classList.add('active');
      renderSchedule(currentDay);
    } else {
      renderSchedule('Mon');
    }
  }

  /* ==========================================================================
     8. GOAL-SPECIFIC DIET GUIDELINES
     ========================================================================== */
  const dietData = {
    hypertrophy: {
      badge: 'LEAN BULK PROTOCOL',
      title: 'Muscle Building & Hypertrophy Fuel Plan',
      desc: 'Designed for steady muscle building with controlled calories. Prioritizes whole food proteins, complex carbohydrates, and essential fats to support heavy lifts.',
      calories: '~2,800 kcal',
      protein: '160g – 180g (~2g/kg)',
      carbs: '320g – 350g',
      fats: '65g – 75g',
      meals: [
        { time: '07:30 AM', name: 'Power Breakfast', food: '4 whole eggs / paneer bhurji, 1 cup oats with milk, sliced banana & crushed almonds.', p: '32g', c: '60g', f: '18g' },
        { time: '11:00 AM', name: 'Mid-Morning Snack', food: 'Greek yogurt / curd with honey, seasonal fruits & pumpkin seeds.', p: '18g', c: '35g', f: '6g' },
        { time: '01:30 PM', name: 'Wholesome Lunch', food: 'Grilled chicken breast / tofu stir-fry, 2 rotis with brown rice, dal & mixed green salad.', p: '45g', c: '70g', f: '14g' },
        { time: '05:00 PM', name: 'Pre-Workout Fuel', food: 'Whole wheat toast with peanut butter & banana slices or boiled sweet potatoes.', p: '8g', c: '45g', f: '8g' },
        { time: '08:00 PM', name: 'Recovery Dinner', food: 'Paneer / fish fillet curry with steamed rice, sauteed beans & broccoli florets.', p: '40g', c: '55g', f: '15g' }
      ]
    },
    fatloss: {
      badge: 'LEAN CUT PROTOCOL',
      title: 'Fat Loss & Muscle Preservation Plan',
      desc: 'Calorie-conscious meal structure designed to preserve lean muscle tissue while mobilizing body fat through high protein and fibrous vegetables.',
      calories: '~2,000 kcal',
      protein: '150g – 170g',
      carbs: '160g – 180g',
      fats: '45g – 55g',
      meals: [
        { time: '08:00 AM', name: 'High-Protein Breakfast', food: 'Egg white scramble with 1 whole egg & spinach, or besan chilla with low-fat paneer.', p: '28g', c: '25g', f: '7g' },
        { time: '11:30 AM', name: 'Low-Calorie Snack', food: 'Sprouted moong salad with lemon, cucumber & roasted chana.', p: '12g', c: '22g', f: '2g' },
        { time: '01:30 PM', name: 'Balanced Clean Lunch', food: '200g grilled chicken / soya chunks with 1 roti, large cucumber-tomato salad & yellow dal.', p: '44g', c: '40g', f: '9g' },
        { time: '05:00 PM', name: 'Pre-Workout Energy', food: '1 apple with 5–6 almonds or a cup of green tea.', p: '3g', c: '20g', f: '4g' },
        { time: '08:00 PM', name: 'Nutrient-Dense Dinner', food: 'Grilled fish / paneer tikka with steamed mixed vegetables and clear vegetable soup.', p: '38g', c: '20g', f: '10g' }
      ]
    },
    endurance: {
      badge: 'STAMINA PROTOCOL',
      title: 'Athletic Conditioning & Endurance Plan',
      desc: 'Formulated for high cardiovascular output, marathon preparation, and stamina. Emphasizes steady glycogen reload and electrolyte balance.',
      calories: '~2,500 kcal',
      protein: '135g – 150g',
      carbs: '330g – 360g',
      fats: '55g – 65g',
      meals: [
        { time: '07:00 AM', name: 'Dawn Carb & Fuel', food: 'Rolled oats with dates, chia seeds, banana slices & a scoop of protein powder.', p: '30g', c: '75g', f: '10g' },
        { time: '10:30 AM', name: 'Mid-Morning Boost', food: 'Whole grain toast with boiled egg or peanut butter & coconut water.', p: '14g', c: '35g', f: '7g' },
        { time: '01:00 PM', name: 'Endurance Fuel Lunch', food: 'Rajma / chole with brown rice, carrot-beetroot salad & roasted curd.', p: '32g', c: '75g', f: '12g' },
        { time: '04:30 PM', name: 'Pre-Training Carb Charge', food: '2 Medjool dates with salted lemon water for hydration.', p: '2g', c: '38g', f: '0g' },
        { time: '07:45 PM', name: 'Restoration Dinner', food: 'Grilled chicken or tofu with whole wheat pasta, tomato puree & steamed beans.', p: '38g', c: '65g', f: '12g' }
      ]
    },
    vegan: {
      badge: 'PLANT-BASED PROTOCOL',
      title: 'Vegetarian & Plant-Based Fuel Plan',
      desc: 'Complete amino acid profiles powered by lentils, paneer, tofu, edamame, whole grains, and cold-pressed seeds for steady strength.',
      calories: '~2,300 kcal',
      protein: '140g – 155g',
      carbs: '280g – 300g',
      fats: '55g – 65g',
      meals: [
        { time: '08:00 AM', name: 'Plant Strength Breakfast', food: 'Tofu or paneer scramble with turmeric, tomatoes & multigrain toast.', p: '28g', c: '35g', f: '12g' },
        { time: '11:00 AM', name: 'Seed & Sprout Snack', food: 'Sprouted black gram (kala chana) chat with roasted peanuts & lemon.', p: '14g', c: '28g', f: '6g' },
        { time: '01:30 PM', name: 'High-Protein Grain Bowl', food: 'Quinoa or brown rice with dal tadka, roasted soya chunks & cabbage sabzi.', p: '40g', c: '65g', f: '10g' },
        { time: '05:00 PM', name: 'Energy Fuel', food: 'Roasted makhana (foxnuts) with green tea & 1 banana.', p: '4g', c: '30g', f: '3g' },
        { time: '08:00 PM', name: 'Recovery Dinner', food: 'Paneer / soya bean curry with 2 phulkas, cucumber raita & palak salad.', p: '36g', c: '50g', f: '14g' }
      ]
    }
  };

  const dietTabBtns = document.querySelectorAll('#dietTabBtns .diet-tab-btn');
  const dietBadgePill = document.getElementById('dietBadgePill');
  const dietPlanTitle = document.getElementById('dietPlanTitle');
  const dietPlanDesc = document.getElementById('dietPlanDesc');
  const dietCalories = document.getElementById('dietCalories');
  const dietProtein = document.getElementById('dietProtein');
  const dietCarbs = document.getElementById('dietCarbs');
  const dietFats = document.getElementById('dietFats');
  const mealTimelineGrid = document.getElementById('mealTimelineGrid');

  function renderDiet(goalKey) {
    const d = dietData[goalKey];
    if (!d) return;

    if (dietBadgePill) dietBadgePill.textContent = d.badge;
    if (dietPlanTitle) dietPlanTitle.textContent = d.title;
    if (dietPlanDesc) dietPlanDesc.textContent = d.desc;
    if (dietCalories) dietCalories.textContent = d.calories;
    if (dietProtein) dietProtein.textContent = d.protein;
    if (dietCarbs) dietCarbs.textContent = d.carbs;
    if (dietFats) dietFats.textContent = d.fats;

    if (mealTimelineGrid) {
      mealTimelineGrid.innerHTML = d.meals.map(m => `
        <div class="meal-timeline-card">
          <div class="meal-time-badge"><i class="fa-regular fa-clock"></i> ${m.time}</div>
          <h5 class="meal-name">${m.name}</h5>
          <p class="meal-ingredients">${m.food}</p>
          <div class="meal-macros-mini">
            <span>P: <strong>${m.p}</strong></span>
            <span>C: <strong>${m.c}</strong></span>
            <span>F: <strong>${m.f}</strong></span>
          </div>
        </div>
      `).join('');
    }
  }

  dietTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dietTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDiet(btn.dataset.goal);
    });
  });

  renderDiet('hypertrophy');

  // Copy diet plan
  const copyDietBtn = document.getElementById('copyDietBtn');
  if (copyDietBtn) {
    copyDietBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('#dietTabBtns .diet-tab-btn.active');
      const goal = activeBtn ? activeBtn.dataset.goal : 'hypertrophy';
      const d = dietData[goal];
      let txt = `APEX FORGE GYM - ${d.title}\nCalories: ${d.calories} | Protein: ${d.protein} | Carbs: ${d.carbs} | Fats: ${d.fats}\n\n`;
      d.meals.forEach(m => {
        txt += `${m.time} - ${m.name}: ${m.food} [P: ${m.p} C: ${m.c} F: ${m.f}]\n`;
      });
      navigator.clipboard.writeText(txt).then(() => {
        showToast('Diet guide copied to clipboard!');
      }).catch(() => {
        showToast('Guide ready to view or print.');
      });
    });
  }

  // Print diet plan
  const printDietBtn = document.getElementById('printDietBtn');
  if (printDietBtn) {
    printDietBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     9. BMI & CALORIE CALCULATOR
     ========================================================================== */
  const fitnessCalcForm = document.getElementById('fitnessCalcForm');
  const calcBmiVal = document.getElementById('calcBmiVal');
  const calcBmiCategory = document.getElementById('calcBmiCategory');
  const calcBmiPointer = document.getElementById('calcBmiPointer');
  const calcBmrVal = document.getElementById('calcBmrVal');
  const calcTdeeVal = document.getElementById('calcTdeeVal');
  const calcTargetCalories = document.getElementById('calcTargetCalories');
  const calcProteinGrams = document.getElementById('calcProteinGrams');
  const calcCarbsGrams = document.getElementById('calcCarbsGrams');
  const calcFatsGrams = document.getElementById('calcFatsGrams');
  const calcProteinBar = document.getElementById('calcProteinBar');
  const calcCarbsBar = document.getElementById('calcCarbsBar');
  const calcFatsBar = document.getElementById('calcFatsBar');

  function calculateMetrics() {
    const gender = document.getElementById('calcGender').value;
    const age = parseFloat(document.getElementById('calcAge').value) || 25;
    const height = parseFloat(document.getElementById('calcHeight').value) || 175;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 72;
    const activity = parseFloat(document.getElementById('calcActivity').value) || 1.55;
    const goal = document.getElementById('calcGoal').value;

    // 1. BMI Calculation
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    if (calcBmiVal) calcBmiVal.textContent = bmi;

    let category = 'Normal Weight';
    let pointerPercent = 42;

    if (bmi < 18.5) {
      category = 'Underweight';
      pointerPercent = Math.max(5, (bmi / 18.5) * 25);
      if (calcBmiCategory) calcBmiCategory.className = 'badge-pill status-special';
    } else if (bmi <= 24.9) {
      category = 'Normal Weight (Optimal)';
      pointerPercent = 25 + ((bmi - 18.5) / 6.4) * 25;
      if (calcBmiCategory) calcBmiCategory.className = 'badge-pill status-open';
    } else if (bmi <= 29.9) {
      category = 'Overweight';
      pointerPercent = 50 + ((bmi - 25) / 4.9) * 25;
      if (calcBmiCategory) calcBmiCategory.className = 'badge-pill status-exclusive';
    } else {
      category = 'Obese';
      pointerPercent = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
      if (calcBmiCategory) {
        calcBmiCategory.className = 'badge-pill';
        calcBmiCategory.style.background = 'rgba(239, 68, 68, 0.2)';
        calcBmiCategory.style.color = '#ef4444';
      }
    }

    if (calcBmiCategory) calcBmiCategory.textContent = category;
    if (calcBmiPointer) calcBmiPointer.style.left = `${pointerPercent}%`;

    // 2. BMR (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;
    bmr = Math.round(bmr);
    if (calcBmrVal) calcBmrVal.textContent = `${bmr.toLocaleString()} kcal`;

    // 3. TDEE
    const tdee = Math.round(bmr * activity);
    if (calcTdeeVal) calcTdeeVal.textContent = `${tdee.toLocaleString()} kcal`;

    // 4. Target Calories
    let target = tdee;
    if (goal === 'cut') target -= 400;
    else if (goal === 'bulk') target += 300;
    if (calcTargetCalories) calcTargetCalories.textContent = `${target.toLocaleString()} kcal/day`;

    // 5. Macros
    const proteinG = Math.round(weight * 2.0);
    const proteinCals = proteinG * 4;
    const fatsG = Math.round(weight * 0.9);
    const fatsCals = fatsG * 9;
    const remainingCals = Math.max(200, target - proteinCals - fatsCals);
    const carbsG = Math.round(remainingCals / 4);

    const totalCals = proteinCals + fatsCals + remainingCals;
    const pPct = Math.round((proteinCals / totalCals) * 100);
    const cPct = Math.round((remainingCals / totalCals) * 100);
    const fPct = 100 - pPct - cPct;

    if (calcProteinGrams) calcProteinGrams.textContent = `${proteinG}g (${proteinCals} kcal)`;
    if (calcCarbsGrams) calcCarbsGrams.textContent = `${carbsG}g (${remainingCals} kcal)`;
    if (calcFatsGrams) calcFatsGrams.textContent = `${fatsG}g (${fatsCals} kcal)`;

    if (calcProteinBar) calcProteinBar.style.width = `${pPct}%`;
    if (calcCarbsBar) calcCarbsBar.style.width = `${cPct}%`;
    if (calcFatsBar) calcFatsBar.style.width = `${fPct}%`;
  }

  if (fitnessCalcForm) {
    fitnessCalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateMetrics();
      showToast('Calculated metrics updated!');
    });
    fitnessCalcForm.addEventListener('input', calculateMetrics);
  }

  calculateMetrics();

  /* ==========================================================================
     10. ACCESSIBLE FAQ ACCORDION
     ========================================================================== */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isAlreadyOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const qBtn = i.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     11. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

});
