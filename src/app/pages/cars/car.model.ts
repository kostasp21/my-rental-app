export interface Car {
  id: any;
  
  car_id?: number; 
  brand: string;
  model: string;
  description?: string;
  date?: string; 
  price_per_day: number | string; 
  quantity: number;
}