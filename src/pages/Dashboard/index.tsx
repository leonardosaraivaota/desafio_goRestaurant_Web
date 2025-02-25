import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      await api.get('foods').then(response => setFoods(response.data));
      // const response = await api.get('/foods');
      // setFoods(response.data);

      /*
      await api.get<IFoodPlate[]>('foods').then(response => {
        const foodFormatted = response.data.map(food => {
          return {
            ...food,
            plateAvailable: food.available ? 'Disponível' : 'Indisponível',
          };
        });
        setFoods(foodFormatted);
      });
      */
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      /*
      const response = await api.post('foods', {
        name: food.name,
        image: food.image,
        description: food.description,
        price: food.price,
        available: true,
      });

      const plate = response.data;

      setFoods([...foods, plate]);
      */
      const response = await api.post(`/foods`, {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      setFoods(
        foods.map(mappedFood =>
          mappedFood.id === editingFood.id ? { ...response.data } : mappedFood,
        ),
      );

      setEditingFood({} as IFoodPlate);
    } catch (err) {
      console.log(err);
    }

    // TODO UPDATE A FOOD PLATE ON THE API
    // console.log(food);
    /*
    const { name, image, description, price } = food;

    const foodIndex = foods.findIndex(f => f.name === name);
    // console.log(foodIndex);
    if (foodIndex < 0) {
      throw new Error('Food not found');
    }

    const editedFood = {
      id: foods[foodIndex].id,
      available: foods[foodIndex].available,
      name,
      image,
      description,
      price,
    };

    await api.put(`foods/${foods[foodIndex].id}`, {
      editedFood,
    });
    */
    /* const newFoods = foods.slice();
    newFoods[foodIndex] = editedFood;
    setFoods(newFoods);
    console.log(foods);
    */
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`foods/${id}`);

    setFoods(foods.filter(food => food.id !== id));
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE

    setEditingFood(food);
    // setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              toogleModal={toggleEditModal}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
