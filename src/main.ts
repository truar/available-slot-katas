function timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
}

function minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}


class AvailableSlot {
    private readonly duration: number

    constructor(private readonly startTime: number, private readonly endTime: number) {
        this.duration = this.endTime - this.startTime
    }

    static fromStrings(startTimeInString: string, endTimeInString: string): AvailableSlot {
        return new AvailableSlot(timeStringToMinutes(startTimeInString), timeStringToMinutes(endTimeInString))
    }

    findBiggestOverlap(other: AvailableSlot): AvailableSlot | null {
        const overlapStart = Math.max(this.startTime, other.startTime)
        const overlapEnd = Math.min(this.endTime, other.endTime)

        // No overlap if start is after or equal to end
        if (overlapStart >= overlapEnd) {
            return null
        }

        return new AvailableSlot(
            overlapStart,
            overlapEnd
        )
    }

    coversTheDuration(durationInMinutes: number): boolean {
        return this.duration >= durationInMinutes
    }

    display(): string {
        return `${minutesToTimeString(this.startTime)} - ${minutesToTimeString(this.endTime)} -- duration=${this.duration}min`
    }
}

const slot1 = AvailableSlot.fromStrings('09:00', '11:00')
const slot2 = AvailableSlot.fromStrings('10:30', '11:00')
const slot3 = AvailableSlot.fromStrings('10:00', '11:00')
const slot4 = AvailableSlot.fromStrings('14:00', '15:00')
const slot5 = AvailableSlot.fromStrings('13:00', '15:00')
const slot7 = AvailableSlot.fromStrings('12:00', '16:00')

const user1Availability = [slot1, slot4]
const user2Availability = [slot2, slot5]
const user3Availability = [slot3, slot7]

function findCommonAvailableSlots(durationInMinutes: number, usersAvailabilities: AvailableSlot[][]): AvailableSlot[] {
    if (usersAvailabilities.length === 0) {
        return []
    }

    // Start with the first user's availability
    let commonSlots = usersAvailabilities[0]

    // Find overlaps with each subsequent user
    for (let i = 1; i < usersAvailabilities.length; i++) {
        const userSlots = usersAvailabilities[i]
        const newCommonSlots: AvailableSlot[] = []

        // Check each common slot against each slot of the current user
        for (const commonSlot of commonSlots) {
            for (const userSlot of userSlots) {
                const overlap = commonSlot.findBiggestOverlap(userSlot)
                if (overlap) {
                    newCommonSlots.push(overlap)
                }
            }
        }

        commonSlots = newCommonSlots

        // If no common slots remain, no point in continuing
        if (commonSlots.length === 0) {
            break
        }
    }

    return commonSlots.filter(slot => slot.coversTheDuration(durationInMinutes))
}

const commonSlots = findCommonAvailableSlots(30, [user1Availability, user2Availability, user3Availability])
if (commonSlots.length === 0) {
    console.log("No common slots found")
} else {
    commonSlots.forEach(slot => console.log(slot.display()))
}



