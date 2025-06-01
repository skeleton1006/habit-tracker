import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'

type Habit = {
  id: number
  name: string
  createdAt: string
}

type HabitCheckin = {
  id: number
  date: string
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [checkins, setCheckins] = useState<HabitCheckin[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchHabits = async () => {
    const res = await fetch('http://localhost:8080/api/habits')
    const data = await res.json()
    setHabits(data)
  }

  const fetchCheckins = async (habitId: number) => {
    const res = await fetch(`http://localhost:8080/api/habits/${habitId}/checkins`)
    const data = await res.json()
    setCheckins(data)
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

  const handleDeleteHabit = async (id: number) => {
    try {
      console.log(`Deleting habit with ID: ${id}`)
      const res = await fetch(`http://localhost:8080/api/habits/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(`Delete response status: ${res.status}`)

      if (res.ok) {
        toast({
          title: '習慣を削除しました',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        await fetchHabits()
      } else if (res.status === 404) {
        const errorText = await res.text()
        console.log(`Error response: ${errorText}`)
        toast({
          title: '習慣が見つかりませんでした',
          description: 'すでに削除されている可能性があります',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
        await fetchHabits()
      } else {
        const errorText = await res.text()
        console.log(`Error response: ${errorText}`)
        toast({
          title: '削除に失敗しました',
          description: 'サーバーエラーが発生しました',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: '削除に失敗しました',
        description: 'ネットワークエラーが発生しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleCheckIn = async (habit: Habit) => {
    const res = await fetch(`http://localhost:8080/api/habits/${habit.id}/checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: format(new Date(), 'yyyy-MM-dd') }),
    })

    if (res.ok) {
      toast({
        title: 'チェックインしました！',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      if (selectedHabit?.id === habit.id) {
        fetchCheckins(habit.id)
      }
    } else {
      const errorText = await res.text()
      toast({
        title: 'チェックインに失敗しました',
        description: errorText,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleShowCalendar = async (habit: Habit) => {
    setSelectedHabit(habit)
    await fetchCheckins(habit.id)
    onOpen()
  }

  const checkinDates = checkins.map(checkin => new Date(checkin.date))

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
            <HStack justify="space-between">
              <Box>
                <Text fontSize='lg' fontWeight='bold'>
                  {habit.name}
                </Text>
                <Text fontSize='sm' color='gray.500'>
                  登録日時: {new Date(habit.createdAt).toLocaleString()}
                </Text>
              </Box>
              <HStack>
                <Button
                  colorScheme='green'
                  size='sm'
                  onClick={() => handleCheckIn(habit)}
                >
                  チェックイン
                </Button>
                <Button
                  colorScheme='blue'
                  size='sm'
                  onClick={() => handleShowCalendar(habit)}
                >
                  カレンダー
                </Button>
                <Button
                  colorScheme='red'
                  size='sm'
                  onClick={() => handleDeleteHabit(habit.id)}
                >
                  削除
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedHabit?.name}の記録</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Calendar
              value={checkinDates}
              tileClassName={({ date }) => {
                return checkinDates.some(
                  checkinDate => 
                    checkinDate.getFullYear() === date.getFullYear() &&
                    checkinDate.getMonth() === date.getMonth() &&
                    checkinDate.getDate() === date.getDate()
                ) ? 'highlight' : ''
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default App
