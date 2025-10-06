#!/usr/bin/env python3
import argparse
import os
import json
import pandas as pd

def excel_to_nested_json(excel_path, output_dir="data"):
    """Converte a sheet 'RawData' do Excel em JSON estruturado."""

    if not os.path.exists(excel_path):
        print(f"❌ Arquivo {excel_path} não encontrado.")
        return

    try:
        df = pd.read_excel(excel_path, sheet_name="RawData")
    except ValueError:
        print(f"❌ Sheet 'RawData' não encontrada no arquivo {excel_path}.")
        return

    nested = {}

    for _, row in df.iterrows():
        bib = row["BibTexKey"]
        text = row["text-passage"]
        code = row.get("code", "")
        practice_instance = row["practice-instance"]
        kp = row["KP"]
        level = row.get("level", "")
        dimension = row["dimension"]

        # Cria árvore aninhada por dimensão → KP → prática
        if dimension not in nested:
            nested[dimension] = {}

        if kp not in nested[dimension]:
            nested[dimension][kp] = {
                "level": level,
                "practice_instances": []
            }

        nested[dimension][kp]["practice_instances"].append({
            "bibtexkey": bib,
            "text": text,
            "code": code,
            "practice_instance": practice_instance
        })

    os.makedirs(output_dir, exist_ok=True)
    json_path = os.path.join(output_dir, "data.json")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(nested, f, indent=4, ensure_ascii=False)

    print(f"✅ Arquivo JSON criado em: {json_path}")


def main():
    parser = argparse.ArgumentParser(description="MM4SLR CLI Tool")
    parser.add_argument("-update", metavar="EXCEL", help="Converte a sheet 'RawData' do Excel em JSON estruturado", required=True)
    args = parser.parse_args()
    excel_to_nested_json(args.update)


if __name__ == "__main__":
    main()
