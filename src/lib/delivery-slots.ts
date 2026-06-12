/** Demo delivery time slots for scheduled orders */
export function getDeliveryTimeSlots(now = new Date()): { id: string; label: string }[] {
  const slots: { id: string; label: string }[] = [{ id: "asap", label: "ASAP (25–45 min)" }];
  const start = new Date(now);
  start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0);
  start.setMinutes(start.getMinutes() + 60);

  for (let i = 0; i < 6; i++) {
    const slot = new Date(start);
    slot.setMinutes(slot.getMinutes() + i * 30);
    const end = new Date(slot);
    end.setMinutes(end.getMinutes() + 30);

    const fmt = (d: Date) =>
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    slots.push({
      id: slot.toISOString(),
      label: `${fmt(slot)} – ${fmt(end)}`,
    });
  }

  return slots;
}
