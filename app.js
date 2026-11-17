(function () {
  // Assemble the contact email at runtime so it isn't sitting in the page text for scrapers.
  var ems = document.querySelectorAll('.em');
  for (var i = 0; i < ems.length; i++) {
    var r = function (s) { return s.split('').reverse().join(''); };
    var a = r(ems[i].getAttribute('data-u')) + '@' + r(ems[i].getAttribute('data-d'));
    if (ems[i].tagName === 'A') ems[i].setAttribute('href', 'mailto:' + a);
    else ems[i].textContent = a;
  }
  var f = document.getElementById('wl');
  if (!f) return;
  var em = document.getElementById('em'), hp = document.getElementById('hp'), go = document.getElementById('go'), msg = document.getElementById('msg');
  function say(t, c) { msg.textContent = t; msg.className = 'note ' + (c || ''); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = em.value.trim().toLowerCase();
    if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { say('Please enter a valid email address.', 'err'); return; }
    go.disabled = true; say('Adding you…');
    fetch('https://hlfuvnuicaoxpupukkrh.supabase.co/functions/v1/join-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZnV2bnVpY2FveHB1cHVra3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzM1ODUsImV4cCI6MjExMDE0OTU4NX0.PwUUyZPlAK2e0sAFz60TBy79t2a76aF2f9rj4HXq0Ws', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZnV2bnVpY2FveHB1cHVra3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzM1ODUsImV4cCI6MjExMDE0OTU4NX0.PwUUyZPlAK2e0sAFz60TBy79t2a76aF2f9rj4HXq0Ws' },
      body: JSON.stringify({ email: v, website: hp.value })
    }).then(function (r) {
      if (r.ok) { say('You’re on the list. We’ll email you when Levelwell launches.', 'ok'); f.reset(); }
      else if (r.status === 429) say('Too many attempts. Please try again in an hour.', 'err');
      else if (r.status === 400) say('Please enter a valid email address.', 'err');
      else say('Something went wrong. Please try again later.', 'err');
    }).catch(function () { say('Something went wrong. Please try again later.', 'err'); }).then(function () { go.disabled = false; });
  });
})();
