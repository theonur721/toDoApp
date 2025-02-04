import {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// uuid id kütüphanesi import
import uuid from 'react-native-uuid';
// async storage import
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // toDo input state
  const [todo, setTodo] = useState('');
  // toDo all-list state
  const [todos, setTodos] = useState([]);

  // addTodo add butonuna tıklanınca eklemek için çalışacak
  const addTodo = () => {
    const updatedTodos = [...todos, {id: uuid.v4(), text: todo}];
    // diziyi güncelle
    setTodos(updatedTodos);
    //local e kaydet
    saveTodos(updatedTodos);
    //ekleme bitince imputu temizler
    setTodo('');
  };

  // async storage locale kaydetme ve alma işlemleri
  const saveTodos = async saveTodo => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodos = async () => {
    try {
      const storageTodos = await AsyncStorage.getItem('todos');
      if (storageTodos) {
        setTodos(JSON.parse(storageTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete todo - filter ile silineni çıkar kalanı güncelle
  const deleteTodo = async id => {
    const updatedTodos = todos.filter(item => item.id !== id);
    // todos state ini güncelle
    setTodos(updatedTodos);
    // storage güncelle
    saveTodos(updatedTodos);
  };

  // update todo - todo yu güncelle
  const updateTodos = id => {
    findTodos = todos?.find(item => item.id === id);
    // id li eleman dizide yoksa fonksiyonu durdur
    if (!findTodos) return;
    // alert-prompt ile güncel todo ismini al
    Alert.prompt('Update Todo', 'enter the new-toDo-name', newText => {
      if (newText) {
        const updateTodos = todos.map(item =>
          item?.id === id ? {...todos, text: newText} : item,
        );
        setTodos(updateTodos);
        saveTodos(updateTodos);
      }
    });
  };

  // useEffect ile sayfa ilk yüklendiğinde async ten todoları yükle
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>React Native Async Storage</Text>
        {/* İnput alanı */}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => setTodo(text)}
            placeholder="Type a ToDo"
            style={styles.input}
          />
          <TouchableOpacity onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* ToDo item alanı */}
        <FlatList
          data={todos}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text style={styles.toDoText}>{item?.text}</Text>
              <View style={styles.row}>
                <View style={styles.deleteContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.updateContainer}>
                  <TouchableOpacity
                    onPress={() => updateTodos(item?.id)}
                    style={styles.updateButton}>
                    <Text style={styles.updateText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    borderRadius: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  addText: {
    color: 'white',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
  toDoText: {
    fontWeight: '600',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 7,
  },
  row: {
    flexDirection: 'row',
  },
  deleteContainer: {
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
  },
  deleteText: {
    color: 'white',
  },
  updateContainer: {
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  updateText: {
    color: 'white',
  },
});
