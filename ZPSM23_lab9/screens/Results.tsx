import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { styles } from '../styles/styles';

const ResultsView: React.FC = () => {
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = async () => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/results?last=20');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const renderResultItem = ({ item }) => (
    <View style={styles.quizBox}>
      <Text style={{ flex: 1 }}>{`Nick: ${item.nick}`}</Text>
      <Text style={{ flex: 1 }}>{`Score: ${item.score}`}</Text>
      <Text style={{ flex: 1 }}>{`Total: ${item.total}`}</Text>
      <Text style={{ flex: 1 }}>{`Type: ${item.type}`}</Text>
      <Text style={{ flex: 1 }}>{`Date: ${new Date(item.createdOn).toLocaleString()}`}</Text>
    </View>
  );


  return (
    <FlatList
      data={results}
      renderItem={renderResultItem}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

export default ResultsView;