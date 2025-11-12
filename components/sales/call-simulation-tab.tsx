"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useDialog } from "@/hooks"
import {
  Play,
  Settings,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Save,
  Eye,
  Trash2,
  Radio,
  Lightbulb,
} from "lucide-react"

interface CallFeedback {
  strengths: string[]
  weaknesses: string[]
  improvementPoints: string[]
  overallScore: number
  callId: string
  date: string
  duration: string
  title: string
  callType: string
}

export function CallSimulationTab() {
  const { showAlert } = useDialog()
  const [selectedCallType, setSelectedCallType] = useState<string | null>(null)
  const [callGoal, setCallGoal] = useState("")
  const [isCallActive, setIsCallActive] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState<CallFeedback | null>(null)
  const [savedSessions, setSavedSessions] = useState<CallFeedback[]>([])
  const [viewingSession, setViewingSession] = useState<CallFeedback | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isListening, setIsListening] = useState(true)
  const [conversation, setConversation] = useState<Array<{ speaker: string; message: string; timestamp: number }>>([])
  const [coachingNudges, setCoachingNudges] = useState<Array<{ message: string; timestamp: number }>>([])

  useEffect(() => {
    const loadSessions = () => {
      const sessions = JSON.parse(localStorage.getItem("callFeedback") || "[]")
      setSavedSessions(sessions)
    }
    loadSessions()
  }, [])

  const callTypes = [
    {
      id: "cold-call",
      title: "Cold Call",
      description: "Initial outreach to new prospects",
    },
    {
      id: "discovery-call",
      title: "Discovery Call",
      description: "Uncover needs and pain points",
    },
    {
      id: "demo-call",
      title: "Demo Call",
      description: "Product demonstration and Q&A",
    },
    {
      id: "follow-up-call",
      title: "Follow-up Call",
      description: "Continue previous conversation",
    },
  ]

  const coachingFeatures = [
    { name: "Real-time transcription", available: true },
    { name: "Post-call feedback", available: true },
    { name: "Performance scoring", available: true },
    { name: "Mid-call coaching (v2)", available: false },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  useEffect(() => {
    if (isCallActive) {
      // Simulate AI prospect responses
      const conversationTimers = [
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            { speaker: "AI Prospect", message: "Hello, this is Sarah Mitchell speaking.", timestamp: Date.now() },
          ])
        }, 2000),
        setTimeout(() => {
          setCoachingNudges((prev) => [
            ...prev,
            { message: "Great! Start with a friendly introduction and state your purpose.", timestamp: Date.now() },
          ])
        }, 5000),
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            {
              speaker: "AI Prospect",
              message: "I'm quite busy right now. What is this regarding?",
              timestamp: Date.now(),
            },
          ])
        }, 15000),
        setTimeout(() => {
          setCoachingNudges((prev) => [
            ...prev,
            {
              message: "Acknowledge their time constraint and quickly establish value. Be concise.",
              timestamp: Date.now(),
            },
          ])
        }, 18000),
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            {
              speaker: "AI Prospect",
              message: "Okay, I can give you a few minutes. Tell me more about your solution.",
              timestamp: Date.now(),
            },
          ])
        }, 35000),
        setTimeout(() => {
          setCoachingNudges((prev) => [
            ...prev,
            {
              message: "Perfect! Now focus on their pain points. Ask discovery questions about their challenges.",
              timestamp: Date.now(),
            },
          ])
        }, 38000),
      ]

      return () => {
        conversationTimers.forEach((timer) => clearTimeout(timer))
      }
    }
  }, [isCallActive])

  const startCall = () => {
    if (!selectedCallType) return
    setIsCallActive(true)
    setShowFeedback(false)
    setCurrentFeedback(null)
    setViewingSession(null)
    setCallDuration(0)
    setConversation([])
    setCoachingNudges([])
    setIsMuted(false)
    setIsListening(true)
  }

  const endCall = () => {
    setIsCallActive(false)
    const selectedType = callTypes.find((type) => type.id === selectedCallType)
    const feedback: CallFeedback = {
      strengths: [
        "Excellent rapport building at the beginning",
        "Asked relevant discovery questions",
        "Handled objections professionally",
      ],
      weaknesses: [
        "Spoke too quickly during value proposition",
        "Missed opportunity to address budget concerns",
        "Could have been more confident in closing",
      ],
      improvementPoints: [
        "Practice slowing down speech during key moments",
        "Develop stronger budget qualification questions",
        "Work on assumptive closing techniques",
      ],
      overallScore: 78,
      callId: `call-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      duration: `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, "0")}`,
      title: `${selectedType?.title || "Call"} Simulation - ${new Date().toLocaleDateString()}`,
      callType: selectedType?.title || "Unknown",
    }
    setCurrentFeedback(feedback)
    setShowFeedback(true)
  }

  const saveFeedback = () => {
    if (currentFeedback) {
      const existingFeedback = JSON.parse(localStorage.getItem("callFeedback") || "[]")
      existingFeedback.unshift(currentFeedback)
      localStorage.setItem("callFeedback", JSON.stringify(existingFeedback))
      setSavedSessions(existingFeedback)
      setShowFeedback(false)
      setCurrentFeedback(null)
      setCallGoal("")
      setSelectedCallType(null)
    }
  }

  const viewSessionFeedback = (session: CallFeedback) => {
    setViewingSession(session)
    setShowFeedback(true)
  }

  const deleteSession = (callId: string) => {
    const updatedSessions = savedSessions.filter((session) => session.callId !== callId)
    localStorage.setItem("callFeedback", JSON.stringify(updatedSessions))
    setSavedSessions(updatedSessions)
  }

  const playSession = (session: CallFeedback) => {
    showAlert({
      title: "Playing Session",
      message: `Playing session: ${session.title}\n\nNote: Audio playback feature coming soon!`,
      confirmText: "OK"
    })
  }

  if (showFeedback && (currentFeedback || viewingSession)) {
    const displayFeedback = currentFeedback || viewingSession
    if (!displayFeedback) return null

    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Call Simulation Feedback</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review your {displayFeedback.callType.toLowerCase()} performance and areas for improvement
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Overall Score */}
            <Card className="text-center animate-fade-in bg-white border-gray-200">
              <CardHeader>
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">{displayFeedback.overallScore}</span>
                </div>
                <CardTitle className="text-2xl">Overall Performance Score</CardTitle>
                <CardDescription>
                  {displayFeedback.overallScore >= 90
                    ? "Excellent work!"
                    : displayFeedback.overallScore >= 80
                      ? "Good performance!"
                      : displayFeedback.overallScore >= 70
                        ? "Room for improvement"
                        : "Needs significant work"}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feedback Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strengths */}
              <Card className="animate-slide-in bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayFeedback.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="animate-slide-in bg-white border-gray-200" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayFeedback.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                      <p className="text-sm">{weakness}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Improvement Points */}
              <Card className="animate-slide-in bg-white border-gray-200" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp className="h-5 w-5" />
                    Improvement Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayFeedback.improvementPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {currentFeedback && (
                <Button size="lg" onClick={saveFeedback} className="gap-2 bg-primary hover:bg-primary/90">
                  <Save className="h-5 w-5" />
                  Save Feedback
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowFeedback(false)
                  setCurrentFeedback(null)
                  setViewingSession(null)
                }}
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Phone className="h-5 w-5" />
                {viewingSession ? "Back to Simulations" : "Start New Simulation"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isCallActive) {
    const selectedType = callTypes.find((type) => type.id === selectedCallType)
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Role Play Simulation</h1>
            <p className="text-sm sm:text-base text-gray-600">Practicing {selectedType?.title.toLowerCase()} with AI prospect</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Call Status Header */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive" className="animate-pulse gap-1">
                        <Radio className="h-3 w-3" />
                        LIVE
                      </Badge>
                      <div className="flex items-center gap-2 text-lg font-mono font-semibold">
                        <Clock className="h-4 w-4" />
                        {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Recording
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-2">{selectedType?.title} with Sarah Mitchell</CardTitle>
                  <CardDescription>VP of Operations at TechFlow Solutions</CardDescription>
                </CardHeader>
              </Card>

              {/* AI Avatar Component */}
              <Card className="bg-linear-to-br from-primary/5 to-blue-50 border-primary/20">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col items-center justify-center">
                    {/* AI Avatar with animated rings */}
                    <div className="relative">
                      {/* Outer animated ring - pulses when AI is speaking */}
                      <div className="absolute inset-0 -m-8">
                        <div
                          className="w-full h-full rounded-full bg-primary/10 animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                      </div>

                      {/* Middle ring */}
                      <div className="absolute inset-0 -m-4">
                        <div
                          className="w-full h-full rounded-full bg-primary/20 animate-pulse"
                          style={{ animationDuration: "1.5s" }}
                        />
                      </div>

                      {/* Main avatar circle */}
                      <div className="relative w-48 h-48 rounded-full bg-linear-to-br from-primary to-blue-600 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white">
                        {/* Avatar face - using a professional silhouette */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Head */}
                          <div className="absolute top-12 w-16 h-16 rounded-full bg-white/90" />

                          {/* Eyes with blink animation */}
                          <div className="absolute top-18 left-1/2 -translate-x-1/2 flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-primary animate-blink" />
                            <div
                              className="w-2 h-2 rounded-full bg-primary animate-blink"
                              style={{ animationDelay: "0.1s" }}
                            />
                          </div>

                          {/* Mouth with talking animation */}
                          <div className="absolute top-22 left-1/2 -translate-x-1/2">
                            <div className="w-6 h-3 rounded-full bg-primary/80 animate-talk" />
                          </div>

                          {/* Body/shoulders */}
                          <div className="absolute bottom-0 w-32 h-24 rounded-t-full bg-white/90" />

                          {/* Sound wave indicator */}
                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                            <div
                              className="w-1 bg-white/60 rounded-full animate-sound-wave"
                              style={{ height: "12px", animationDelay: "0s" }}
                            />
                            <div
                              className="w-1 bg-white/60 rounded-full animate-sound-wave"
                              style={{ height: "16px", animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-1 bg-white/60 rounded-full animate-sound-wave"
                              style={{ height: "20px", animationDelay: "0.2s" }}
                            />
                            <div
                              className="w-1 bg-white/60 rounded-full animate-sound-wave"
                              style={{ height: "16px", animationDelay: "0.3s" }}
                            />
                            <div
                              className="w-1 bg-white/60 rounded-full animate-sound-wave"
                              style={{ height: "12px", animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Avatar label */}
                    <div className="mt-8 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Mitchell</h3>
                      <p className="text-sm text-gray-600 mb-2">AI Prospect • VP of Operations</p>
                      <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Speaking
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Transcript */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Live Conversation</CardTitle>
                  <CardDescription>AI prospect responses appear in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 min-h-[300px] max-h-[300px] overflow-y-auto">
                    {conversation.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm">Waiting for conversation to begin...</p>
                      </div>
                    ) : (
                      conversation.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.speaker === "AI Prospect" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-lg ${message.speaker === "AI Prospect" ? "bg-gray-100 text-gray-900" : "bg-primary text-white"
                              }`}
                          >
                            <p className="text-xs font-semibold mb-1 opacity-70">{message.speaker}</p>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* User Input Section */}
              <Card className="bg-white border-gray-200">
                <CardContent className="pt-6">
                  {/* Mobile layout: 3 rows */}
                  <div className="sm:hidden space-y-4">
                    {/* Row 1: Mic icon */}
                    <div className="flex justify-center">
                      <div
                        className={`p-4 rounded-full ${isListening && !isMuted ? "bg-green-100 animate-pulse" : "bg-gray-100"}`}
                      >
                        {isMuted ? (
                          <MicOff className="h-6 w-6 text-gray-400" />
                        ) : (
                          <Mic className={`h-6 w-6 ${isListening ? "text-green-600" : "text-gray-400"}`} />
                        )}
                      </div>
                    </div>

                    {/* Row 2: Text */}
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {isMuted ? "Microphone Muted" : isListening ? "Listening..." : "Microphone Ready"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isMuted ? "Click to unmute and speak" : "Your speech is being captured and analyzed by AI"}
                      </p>
                    </div>

                    {/* Row 3: Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-full sm:flex-1 gap-2 ${isMuted ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : ""}`}
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        <span className="sm:inline">{isMuted ? "Unmute" : "Mute"}</span>
                      </Button>
                      <Button variant="destructive" size="lg" onClick={endCall} className="w-full sm:flex-1 gap-2">
                        <PhoneOff className="h-5 w-5" />
                        <span className="sm:inline">End Call</span>
                      </Button>
                    </div>
                  </div>

                  {/* Medium and large devices: Original layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-full ${isListening && !isMuted ? "bg-green-100 animate-pulse" : "bg-gray-100"}`}
                      >
                        {isMuted ? (
                          <MicOff className="h-6 w-6 text-gray-400" />
                        ) : (
                          <Mic className={`h-6 w-6 ${isListening ? "text-green-600" : "text-gray-400"}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {isMuted ? "Microphone Muted" : isListening ? "Listening..." : "Microphone Ready"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isMuted ? "Click to unmute and speak" : "Your speech is being captured and analyzed by AI"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`gap-2 ${isMuted ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : ""}`}
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        {isMuted ? "Unmute" : "Mute"}
                      </Button>
                      <Button variant="destructive" size="lg" onClick={endCall} className="gap-2">
                        <PhoneOff className="h-5 w-5" />
                        End Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Coaching Nudges */}
            <Card className="bg-white border-gray-200 h-auto self-start">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Real-Time Coaching
                </CardTitle>
                <CardDescription>AI-powered tips during your call</CardDescription>
              </CardHeader>
              <CardContent className="h-auto">
                <div className="space-y-3">
                  {coachingNudges.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Coaching tips will appear here during your call
                      </p>
                    </div>
                  ) : (
                    coachingNudges.map((nudge, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-in"
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                          <p className="text-sm text-gray-900">{nudge.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Prospect Info Quick Reference */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Prospect Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">Sarah Mitchell</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <span className="ml-2 font-medium">VP of Operations</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <span className="ml-2 font-medium">Direct, data-driven</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-gray-600 mb-1">Key Pain Points:</p>
                    <ul className="space-y-1 ml-2">
                      <li className="text-xs">• Manual processes (30% loss)</li>
                      <li className="text-xs">• Project tracking issues</li>
                      <li className="text-xs">• Remote collaboration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Call Simulation</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Practice your sales calls with AI prospects and receive real-time coaching feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Select Call Type */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Select Call Type</CardTitle>
                <CardDescription>Choose the type of call you want to simulate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {callTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedCallType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedCallType(type.id)}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call Goal */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Call Goal</CardTitle>
                <CardDescription>Define what you want to achieve in this call</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Schedule a demo meeting, qualify budget and timeline, understand current pain points..."
                  value={callGoal}
                  onChange={(e) => setCallGoal(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </CardContent>
            </Card>

            {/* AI Prospect Profile */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">AI Prospect Profile</CardTitle>
                <CardDescription>The AI will simulate this prospect during your call</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Company Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Company Info</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <span className="ml-2 font-medium">TechFlow Solutions</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Industry:</span>
                        <span className="ml-2 font-medium">Software Development</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium">150-200 employees</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-2 font-medium">$25M annually</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">Sarah Mitchell</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Title:</span>
                        <span className="ml-2 font-medium">VP of Operations</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">8 years in role</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Communication Style:</span>
                        <span className="ml-2 font-medium">Direct, data-driven</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Challenges */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Current Challenges</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                        <p className="text-sm text-gray-700">Manual processes causing 30% productivity loss</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                        <p className="text-sm text-gray-700">Difficulty tracking project timelines and budgets</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                        <p className="text-sm text-gray-700">Team collaboration issues with remote workforce</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                        <p className="text-sm text-gray-700">Limited visibility into resource allocation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Simulation Controls */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Simulation Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={startCall}
                  disabled={!selectedCallType}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
                {!selectedCallType && (
                  <p className="text-xs text-gray-500 text-center">Please select a call type first</p>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Call Duration</span>
                    <span className="font-medium">15 min max</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coaching Mode</span>
                    <span className="font-medium">Post-call</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium">Intermediate</span>
                  </div>
                </div>

                <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                  <Settings className="w-4 h-4 mr-2" />
                  Simulation Settings
                </Button>
              </CardContent>
            </Card>

            {/* Coaching Features */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Coaching Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coachingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${feature.available ? "bg-green-500" : "bg-yellow-500"}`} />
                      <span className={`text-sm ${feature.available ? "text-gray-900" : "text-gray-600"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {savedSessions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No saved sessions yet</p>
                ) : (
                  <div className="space-y-3">
                    {savedSessions.slice(0, 5).map((session) => (
                      <div key={session.callId} className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{session.callType}</p>
                            <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{session.overallScore}/100</p>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                        </div>
                        <div className="flex">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => playSession(session)}
                            className="flex-1 h-8 text-xs hover:bg-primary/10 hover:text-primary"
                          >
                            <Play className="h-3 w-3" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => viewSessionFeedback(session)}
                            className="flex-1 h-8 text-xs hover:bg-primary/10 hover:text-primary"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSession(session.callId)}
                            className="flex-1 h-8 text-xs hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
