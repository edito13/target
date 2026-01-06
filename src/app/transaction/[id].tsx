import React, { useState } from "react";
import { Alert, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import CurrencyInput from "@/components/CurrencyInput";
import TransactionType from "@/components/TransactionType";

import { TransactionTypes } from "@/types";
import useNotifications from "@/hooks/useNotifications";
import useTransactionsDatabase from "@/database/useTransactionsDatabase";
import { NumberToCurrency } from "@/utils/numberToCurrency";

interface TransactionProps {}

const Transaction: React.FC<TransactionProps> = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const transactionsDatabase = useTransactionsDatabase();
  const { handleNotificate } = useNotifications();

  const [amount, setAmount] = useState(0);
  const [observation, setObservation] = useState("");
  const [isCreating, setisCreating] = useState(false);
  const [type, setType] = useState<TransactionTypes>(TransactionTypes.Input);

  const handleCreate = async () => {
    const payload = { amount, observation, target_id: Number(params.id) };

    try {
      if (amount <= 0) {
        return Alert.alert(
          "Atenção",
          "Preencha o valor e este deve ser maior que zero."
        );
      }

      setisCreating(true);
      await transactionsDatabase.create({
        ...payload,
        amount: type === TransactionTypes.Output ? amount * -1 : amount,
      });
      handleNotificate({
        title: "Nova transação",
        message: `Sua transação de ${NumberToCurrency(
          amount
        )} foi feita com sucesso`,
      });
      setTimeout(() => router.back(), 1000);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a transação.");
      console.log(error);
      setisCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />
        <CurrencyInput
          value={amount}
          label="Valor (KZ)"
          onChangeValue={setAmount}
        />
        <Input
          value={observation}
          label="Motivo (opcional)"
          onChangeText={setObservation}
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
        />
        <Button
          title="Salvar"
          onPress={handleCreate}
          isProcessing={isCreating}
        />
      </View>
    </View>
  );
};

export default Transaction;
