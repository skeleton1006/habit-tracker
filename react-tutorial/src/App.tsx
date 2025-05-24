import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'

type Habit = {
  id: number
  name: string
  createdAt: string
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const toast = useToast()

  const fetchHabits = async () => {
    const res = await fetch('http://localhost:8080/api/habits')
    const data = await res.json()
    setHabits(data)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  const handleAddHabit = async () => {
    if (!newHabit.trim()) {
      toast({
        title: '習慣名を入力してください。',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    const res = await fetch('http://localhost:8080/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newHabit }),
    })

    if (res.ok) {
      setNewHabit('')
      toast({
        title: '習慣を追加しました！',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      fetchHabits()
    } else {
      toast({
        title: '追加に失敗しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={8}>
      <Heading mb={4}>習慣一覧</Heading>

      <Stack direction='row' mb={6}>
        <Input
          placeholder='新しい習慣を入力'
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <Button colorScheme='blue' onClick={handleAddHabit}>
          追加
        </Button>
      </Stack>

      <Stack spacing={4}>
        {habits.map((habit) => (
          <Box
            key={habit.id}
            p={4}
            borderWidth='1px'
            borderRadius='md'
            bg='blue.50'
            boxShadow='sm'
          >
            <Text fontSize='lg' fontWeight='bold'>
              {habit.name}
            </Text>
            <Text fontSize='sm' color='gray.500'>
              登録日時: {new Date(habit.createdAt).toLocaleString()}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default App
