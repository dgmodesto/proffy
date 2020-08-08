import React, { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'


import styles from './style'
import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList() {
  const [isFiltersVisible, setIsFilterVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);


  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeacherIds = favoritedTeachers.map((teacher: Teacher) => { return teacher.id });

        setFavorites(favoritedTeacherIds);
      }
    })
  }

  useFocusEffect(() => {
    loadFavorites();
  });



  function handleToggleFiltersVisible() {
    setIsFilterVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit() {
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    });
    setIsFilterVisible(false);
    setTeachers(response.data);
  }

  return (
    <View style={styles.container} >
      <PageHeader
        title="Proffys disponíveis"
        headerRight={(
          <BorderlessButton
            onPress={handleToggleFiltersVisible}
          >
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        )}>
        {isFiltersVisible && (<View style={styles.searchForm}>
          <Text style={styles.label}>Matéria</Text>
          <TextInput style={styles.input}
            placeholderTextColor="#c1bccc"
            value={subject}
            onChangeText={text => setSubject(text)}
            placeholder="Qual é a matéria" />

          <View style={styles.inputGroup}>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Dia da semana</Text>
              <TextInput
                style={styles.input}

                placeholderTextColor="#c1bccc"
                value={week_day}
                onChangeText={text => setWeekDay(text)}
                placeholder="Qual o dia"
              />
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                style={styles.input}

                placeholderTextColor="#c1bccc"
                value={time}
                onChangeText={text => setTime(text)}
                placeholder="Qual horário"
              />
            </View>
          </View>

          <RectButton
            onPress={handleFiltersSubmit}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Filtrar</Text>

          </RectButton>
        </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          )
        })}

      </ScrollView>


    </View>
  )

}


export default TeacherList;