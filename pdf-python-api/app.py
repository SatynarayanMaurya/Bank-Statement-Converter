

# from flask import Flask, request, jsonify
# import tabula
# import pandas as pd
# import os
# import json
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/extract-transactions', methods=['POST'])
# def extract_transactions():
#     file = request.files.get('pdfInput')

#     if not file or file.filename == '':
#         return jsonify({'error': 'No file provided'}), 400

#     file_path = "temp.pdf"
#     file.save(file_path)

#     try:
#         expected_headers = ['Date', 'Details', 'Chq. No.', 'Debit', 'Credit', 'Balance']

#         # Extract tables from all pages
#         tables = tabula.read_pdf(file_path, pages='all', stream=True)

#         if not tables or len(tables) == 0:
#             return jsonify({'error': 'No tables found'}), 400

#         valid_tables = []
#         for idx, t in enumerate(tables):
#             t_clean = t.dropna(how='all', axis=1)
#             if t_clean.shape[1] >= len(expected_headers):
#                 print(f"Including table {idx} with shape {t_clean.shape}")
#                 t_clean = t_clean.iloc[:, :len(expected_headers)]
#                 t_clean.columns = expected_headers
#                 valid_tables.append(t_clean)
#             else:
#                 print(f"Skipping table {idx} with shape {t_clean.shape}")


#         if not valid_tables:
#             return jsonify({'error': 'No valid tables with correct column count found'}), 400

#         # Merge valid tables
#         df = pd.concat(valid_tables, ignore_index=True)

#         if df.shape[1] > len(expected_headers):
#             df = df.iloc[:, :len(expected_headers)]
#         elif df.shape[1] < len(expected_headers):
#             return jsonify({'error': f'Header length mismatch: PDF has {df.shape[1]} columns'}), 400

#         df.columns = expected_headers


#         # Replace NaN with None
#         df = df.where(pd.notnull(df), None)

#         # Convert DataFrame to list of dictionaries
#         raw_rows = df.to_dict(orient='records')

#         # Clean and merge multiline transaction rows
#         cleaned_rows = []
#         current_row = {
#             'Date': None,
#             'Details': '',
#             'Chq. No.': '',
#             'Debit': '',
#             'Credit': '',
#             'Balance': ''
#         }

#         for row in raw_rows:
#             if row.get('Date'):  # New transaction starts
#                 if current_row['Date']:
#                     cleaned_rows.append(current_row)
#                 current_row = {
#                     'Date': row.get('Date'),
#                     'Details': str(row.get('Details') or '').strip(),
#                     'Chq. No.': str(row.get('Chq. No.') or '').strip(),
#                     'Debit': str(row.get('Debit') or '').strip(),
#                     'Credit': str(row.get('Credit') or '').strip(),
#                     'Balance': str(row.get('Balance') or '').strip()
#                 }
#             else:
#                 # Merge continuation rows
#                 for key in ['Details', 'Chq. No.', 'Debit', 'Credit', 'Balance']:
#                     val = row.get(key)
#                     if val:
#                         current_val = str(current_row.get(key) or "").strip()
#                         new_val = str(val).strip()
#                         current_row[key] = f"{current_val} {new_val}".strip()

#         if current_row['Date']:  # Add the last row
#             cleaned_rows.append(current_row)

#         return jsonify({'transactions': cleaned_rows})

#     except Exception as e:
#         print("Error:", e)
#         return jsonify({'error': str(e)}), 500

#     finally:
#         if os.path.exists(file_path):
#             os.remove(file_path)

# if __name__ == '__main__':
#     app.run(debug=True)



















# from flask import Flask, request, jsonify
# import tabula
# import pandas as pd
# import os
# import json
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.route('/extract-transactions', methods=['POST'])
# def extract_transactions():
#     file = request.files.get('pdfInput')

#     if not file or file.filename == '':
#         return jsonify({'error': 'No file provided'}), 400

#     file_path = "temp.pdf"
#     file.save(file_path)

#     try:
#         expected_headers = ['Date', 'Details', 'Chq. No.', 'Debit', 'Credit', 'Balance']

#         # Extract tables from PDF
#         tables = tabula.read_pdf(file_path, pages='all', stream=True)

#         if not tables or len(tables) == 0:
#             return jsonify({'error': 'No tables found'}), 400

#         # df = tables[0]
#         df = pd.concat(tables, ignore_index=True)


#         df = df.dropna(how='all', axis=1)

#         # Normalize headers
#         if len(df.columns) != len(expected_headers):
#             return jsonify({'error': 'Header length mismatch'}), 400

#         df.columns = expected_headers

#         # Convert DataFrame to list of dictionaries
#         df = df.where(pd.notnull(df), None)  # replace NaN with None
#         raw_rows = df.to_dict(orient='records')


#         # Clean and merge multiline transaction rows
#         cleaned_rows = []
#         current_row = {
#             'Date': None,
#             'Details': '',
#             'Chq. No.': '',
#             'Debit': '',
#             'Credit': '',
#             'Balance': ''
#         }

#         for row in raw_rows:
#             if row.get('Date'):  # New transaction starts
#                 if current_row['Date']:
#                     cleaned_rows.append(current_row)
#                 current_row = {
#                     'Date': row.get('Date'),
#                     'Details': row.get('Details') or '',
#                     'Chq. No.': row.get('Chq. No.') or '',
#                     'Debit': row.get('Debit') or '',
#                     'Credit': row.get('Credit') or '',
#                     'Balance': row.get('Balance') or ''
#                 }
#             else:
#                 # Merge continuation rows
#                 for key in ['Details', 'Chq. No.', 'Debit', 'Credit', 'Balance']:
#                     val = row.get(key)
#                     if val:
#                         current_val = str(current_row.get(key) or "").strip()
#                         new_val = str(val).strip()
#                         current_row[key] = f"{current_val} {new_val}".strip()


#         if current_row['Date']:  # Add the last row
#             cleaned_rows.append(current_row)

#         return jsonify({'transactions': cleaned_rows})

#     except Exception as e:
#         print("Error:", e)
#         return jsonify({'error': str(e)}), 500
#     finally:
#         if os.path.exists(file_path):
#             os.remove(file_path)

# if __name__ == '__main__':
#     app.run(debug=True)












from flask import Flask, request, jsonify
import tabula
import pandas as pd
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/extract-transactions', methods=['POST'])
def extract_transactions():

    # if 'file' not in request.files:
    #     return jsonify({'error': 'No file provided'}), 400
    # print("Request is : ",request.files)
    file = request.files.get('pdfInput')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = "temp.pdf"
    file.save(file_path)

    try:
        tables = tabula.read_pdf(file_path, pages='all', multiple_tables=False, lattice=False)
        # tables = tabula.read_pdf(file_path, pages='all', stream=True)


        if not tables:
            return jsonify({'error': 'No tables found'}), 400

        df = tables[0]

        # OPTIONAL: Fix if the header is wrongly placed in first row
        first_row = df.iloc[0]
        if "Date" in first_row.values or "Transaction" in first_row.values:
            df.columns = df.iloc[0]
            df = df[1:].reset_index(drop=True)

        data = json.loads(df.to_json(orient='records'))

        return jsonify({'transactions': data})

    except Exception as e:
        print("error : ",e)
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(file_path)

if __name__ == '__main__':
    app.run(debug=True)
