import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export function useSocket() {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [pods, setPods] = useState([])
  const [sensorData, setSensorData] = useState(null)

  useEffect(() => {
    const socket = io(BACKEND_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('init', ({ pods: p, latest }) => {
      setPods(p)
      if (latest) setSensorData(latest)
    })

    socket.on('pod:update', (updated) => {
      setPods(prev => prev.map(p => p.pod_id === updated.pod_id ? updated : p))
    })

    socket.on('sensor:update', (reading) => {
      setSensorData(reading)
    })

    return () => socket.disconnect()
  }, [])

  const updatePod = async (podId, species, plantedAt, token) => {
    const res = await fetch(`${BACKEND_URL}/api/pods/${podId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ species: species ?? null, planted_at: plantedAt ?? null }),
    })
    return res.status
  }

  return { connected, pods, sensorData, updatePod }
}
