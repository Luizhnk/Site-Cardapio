import { OperatingHours } from '../types/restaurant';

export interface StoreStatusResult {
  isOpen: boolean;
  statusLabel: string;
  message: string;
  todayScheduleText: string;
}

export function checkStoreOpenStatus(operatingHours: OperatingHours): StoreStatusResult {
  // Check override mode
  if (operatingHours.mode === 'forced_open') {
    return {
      isOpen: true,
      statusLabel: 'Aberto agora',
      message: 'Loja aberta para pedidos!',
      todayScheduleText: 'Aberto (horário especial)',
    };
  }

  if (operatingHours.mode === 'forced_closed') {
    return {
      isOpen: false,
      statusLabel: 'Fechado no momento',
      message: 'Estamos temporariamente fechados para novos pedidos. Você pode navegar pelo cardápio!',
      todayScheduleText: 'Fechado temporariamente',
    };
  }

  // Automatic calculation based on current time
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const dayMap: { [key: number]: keyof OperatingHours['days'] } = {
    0: 'domingo',
    1: 'segunda',
    2: 'terca',
    3: 'quarta',
    4: 'quinta',
    5: 'sexta',
    6: 'sabado',
  };

  const dayKey = dayMap[dayIndex];
  const todayConfig = operatingHours.days[dayKey];

  if (!todayConfig || !todayConfig.enabled) {
    return {
      isOpen: false,
      statusLabel: 'Fechado hoje',
      message: 'Hoje nosso restaurante não está atendendo delivery. Você pode navegar pelos produtos do cardápio!',
      todayScheduleText: 'Não abre hoje',
    };
  }

  const [startHour, startMin] = todayConfig.start.split(':').map(Number);
  const [endHour, endMin] = todayConfig.end.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Handle shifts ending after midnight (e.g. 18:00 to 01:00)
  let isOpen = false;
  if (endMinutes < startMinutes) {
    // Overnight schedule
    isOpen = currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  } else {
    isOpen = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  const scheduleText = `${todayConfig.start} às ${todayConfig.end}`;

  if (isOpen) {
    return {
      isOpen: true,
      statusLabel: 'Aberto agora',
      message: `Aberto hoje das ${scheduleText}`,
      todayScheduleText: scheduleText,
    };
  } else {
    return {
      isOpen: false,
      statusLabel: 'Fechado no momento',
      message: `Estamos fechados no momento. Horário de funcionamento hoje: ${scheduleText}. Pedidos desabilitados.`,
      todayScheduleText: scheduleText,
    };
  }
}
