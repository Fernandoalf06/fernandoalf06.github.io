document.addEventListener('DOMContentLoaded', function() {
    let data; // Declare data in a broader scope

    // Ambil data makanan dari backend saat halaman dimuat
    fetch('http://localhost:8080/api/foods')
        .then(response => response.json())
        .then(apiData => {
            data = apiData; // Set the data in the broader scope

            // Inisialisasi dropdown/select
            const foodSelect = document.getElementById('foodName');

            // Isi dropdown/select dengan opsi makanan dari data
            data.forEach(foodItem => {
                const option = document.createElement('option');
                option.value = foodItem.food;
                option.text = foodItem.food;
                foodSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));

    // Tangkap form submit
    document.getElementById('foodForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Ensure data is loaded before proceeding
        if (!data) {
            console.error('Data not loaded yet');
            return;
        }

        // Ambil nilai input
        const userName = document.getElementById('userName').value;
        const selectedFood = document.getElementById('foodName').value;
        const servingSize = parseFloat(document.getElementById('servingSize').value) || 1; // Default to 1 if not provided

        // Cari data makanan yang dipilih dari response API
        const selectedFoodData = data.find(foodItem => foodItem.food === selectedFood);

        // Kirim data makanan yang dipilih ke backend
        fetch('http://localhost:8080/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                food: selectedFood,
                servingSize: servingSize,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            // Tambahkan data yang dipilih ke tabel
            const trackedFoodBody = document.getElementById('trackedFoodBody');
            const newRow = trackedFoodBody.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3); // New cell for "Jumlah Sajian"
            const cell5 = newRow.insertCell(4); // Adjust index for "Kalori"
            cell1.innerHTML = userName;
            cell2.innerHTML = selectedFood;

            // Menambahkan data "Per Saji" dan "Jumlah Sajian"
            if (selectedFoodData) {
                cell3.innerHTML = selectedFoodData.serving;
                cell4.innerHTML = servingSize;
                cell5.innerHTML = calculateCalories(selectedFoodData.calories, servingSize);
            } else {
                cell3.innerHTML = 'Data not available';
                cell4.innerHTML = 'Data not available';
                cell5.innerHTML = 'Data not available';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to calculate calories based on serving size
    function calculateCalories(calories, servingSize) {
        const caloriesPerServing = parseFloat(calories.replace(' cal', '')); // Extract numeric calories
        return servingSize * caloriesPerServing;
    }
});
