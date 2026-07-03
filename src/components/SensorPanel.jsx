import { Droplets, Thermometer, Zap, Wifi, WifiOff } from 'lucide-react'

export default function SensorPanel({ sensorData, connected }) {
  const fmt = (v, d = 1) => v != null ? Number(v).toFixed(d) : '—'

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Live Sensor Data</h2>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${connected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Metric icon={<Droplets size={20} className="text-blue-400" />} label="pH" value={fmt(sensorData?.ph)} unit="" ideal="5.5–7.0" />
        <Metric icon={<Zap size={20} className="text-yellow-400" />} label="EC" value={fmt(sensorData?.ec)} unit="mS/cm" ideal="0.8–3.5" />
        <Metric icon={<Thermometer size={20} className="text-orange-400" />} label="Temp" value={fmt(sensorData?.temp_f, 0)} unit="°F" ideal="60–85°F" />
      </div>
      {sensorData?.recorded_at && (
        <p className="text-xs text-slate-500 mt-3">
          Last updated: {new Date(sensorData.recorded_at).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

function Metric({ icon, label, value, unit, ideal }) {
  return (
    <div className="bg-slate-900 rounded-lg p-3 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 text-xs">{icon}{label}</div>
      <div className="text-2xl font-bold text-slate-100">
        {value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">ideal: {ideal}</div>
    </div>
  )
}
