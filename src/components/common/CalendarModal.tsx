import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../theme/ThemeContext';

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
    onDayPress: (day: any) => void;
    selectedDate: string;
    marking?: any;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
    visible,
    onClose,
    onDayPress,
    selectedDate,
    marking
}) => {
    const theme = useTheme();
    const accentColor = '#f83d37'; // Sabit kırmızı renk

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalCalendarContainer, { backgroundColor: theme.colors.surface }]}>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={
                            marking || {
                                [selectedDate]: { selected: true, selectedColor: accentColor },
                            }
                        }
                        theme={{
                            backgroundColor: theme.colors.surface,
                            calendarBackground: theme.colors.surface,
                            dayTextColor: theme.colors.text.primary,
                            monthTextColor: accentColor,
                            arrowColor: accentColor,
                            textDisabledColor: theme.colors.text.secondary,
                            dotColor: accentColor,
                            selectedDayBackgroundColor: accentColor,
                            selectedDayTextColor: theme.colors.text.primary,
                            todayTextColor: accentColor,
                        }}
                        style={styles.calendar}
                    />
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.closeModalBtn, { backgroundColor: accentColor }]}
                    >
                        <Text style={styles.closeModalText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCalendarContainer: {
        borderRadius: 16,
        padding: 16,
        width: '90%',
        alignItems: 'center',
    },
    calendar: {
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
    },
    closeModalBtn: {
        marginTop: 12,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    closeModalText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CalendarModal; 