package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

type FoodItem struct {
	Food     string `json:"food"`
	Serving  string `json:"serving"`
	Calories string `json:"calories"`
}

var foodDatabase []FoodItem

func loadFoodDatabase() {
	file, err := os.Open("./data/Food and Calories - Sheet1.csv")
	if err != nil {
		log.Fatalf("Error opening food database: %v", err)
	}
	defer file.Close()

	csvReader := csv.NewReader(file)
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatalf("Error parsing CSV: %v", err)
	}

	for _, record := range records[1:] {
		foodDatabase = append(foodDatabase, FoodItem{
			Food:     record[0],
			Serving:  record[1],
			Calories: record[2],
		})
	}
	fmt.Println("Loaded food database:", foodDatabase)
}

func main() {
	loadFoodDatabase()

	router := gin.Default()

	// Serve HTML file
	router.StaticFile("/", "./static/index.html")
	router.Static("/calorie-tracker", "./static")

	// API endpoint to get the list of foods
	router.GET("/api/foods", func(c *gin.Context) {
		c.JSON(200, foodDatabase)
	})

	// API endpoint to track selected foods
	router.POST("/api/track", func(c *gin.Context) {
		var selectedFood FoodItem
		if err := c.BindJSON(&selectedFood); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		// Handle logic to store selected food data in a database or storage

		c.JSON(200, gin.H{"message": "Food tracked successfully"})
	})

	// Run the server on port 8080
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Error starting the server: %v", err)
	}
}
