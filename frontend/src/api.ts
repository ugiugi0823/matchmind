export async function predictShot(data: {
    x: number,
    y: number,
    spId: number,
    spGrade: number,
    spLevel: number
}) {
    const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await response.json();
}
