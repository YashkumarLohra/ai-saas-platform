async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'I want to make a presentation' })
    });
    
    if (!res.ok) {
      console.log('HTTP Error:', res.status, res.statusText);
      const text = await res.text();
      console.log('Response:', text);
      return;
    }
    
    const json = await res.json();
    console.log('Success:', json.success);
    console.log('Recommendations count:', json.recommendations?.length);
    if (json.recommendations?.length > 0) {
      console.log('First recommendation:', JSON.stringify(json.recommendations[0], null, 2));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
