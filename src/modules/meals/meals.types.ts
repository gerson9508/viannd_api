export interface Meal {

 id: number
 userId: number

 foodId: number
 quantity: number

 mealType: number

 date: string
 time: string

 outsideDiet: boolean
 completed: boolean

 dayId?: number

}